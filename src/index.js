import { init, GameLoop, Sprite, initKeys, keyPressed } from 'kontra';
// import './sass/styles.scss';
import tileImg from './assets/images/tile.png';
import playerImg from './assets/images/player.png';

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const convert2DtoIso = (x, y) => {
    let isoPoint = new Point(x, y);
    isoPoint.x = x - y;
    isoPoint.y = (x + y) / 2;
    return isoPoint;
}

const convertIsoTo2D = (x, y) => {
    let cartPoint = new Point(x, y);
    cartPoint.x = (2 * y + x) / 2;
    cartPoint.y = (2 * y - x) / 2;
    return cartPoint;
}

const generateMap = () => {
    const tileMap = [];
    const tileImage = new Image();
    tileImage.src = tileImg;
    tileImage.height = 80;
    tileImage.width = 80;
    let isoHeight = 40;
    let isoWidth = 40;
    for (let i = -400; i < 400; i +=isoHeight) {
        let tileLine = [];
        for (let j = -100; j < 700; j +=isoWidth) {
            let isoPoint = convert2DtoIso(j, i);
            tileLine.push(Sprite({
                x: isoPoint.x,
                y: isoPoint.y,
                width: isoWidth,
                height: isoHeight,
                image: tileImage
            }));
        }
        tileMap.push(tileLine);
    }
    return tileMap;
}

const main = () => {
    const { canvas, context } = init();
    initKeys();
    let tileMap = generateMap();
    // draw a purple rectangle
    // context.fillStyle = '#9c54e6';
    // context.fillRect(100, 100, canvas.width / 4, canvas.height / 4);
    const playerImage = new Image();
    playerImage.src = playerImg;
    playerImage.width = 40;
    playerImage.height = 40;
    const playerPoint = convert2DtoIso(8 * 40, 4 * 40);
    const player = Sprite({
        x: playerPoint.x,
        y: playerPoint.y,
        width: 40,
        height: 40,
        image: playerImage
    });
    const playerStep = 40;
    const loop = GameLoop({
        update: () => {
            let dx = 0;
            let dy = 0;
            if (keyPressed('left')) {
                dx = -1;
            } else if (keyPressed('right')) {
                dx = 1;
            }
            if (keyPressed('up')) {
                dy = -1;
            } else if (keyPressed('down')) {
                dy = 1;
            }
            const twoDPos = convertIsoTo2D(player.x, player.y);
            const isoDxDy = convert2DtoIso(twoDPos.x + dx, twoDPos.y + dy);
            player.x = isoDxDy.x;
            player.y = isoDxDy.y;
        },
        render: () => {
            console.log('rendering...')
            context.globalAlpha = 0.2;
            
            tileMap.flat(2).forEach(t => {
                t.render();
                let cartPoint = convertIsoTo2D(t.x, t.y);
                context.fillText(`(${cartPoint.x},${cartPoint.y})`, t.x, t.y);
            });
            context.globalAlpha = 1;
            player.render();
        }
    });

    loop.start();
}

main();