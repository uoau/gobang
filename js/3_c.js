import gameData from './2_v.js';
const chessBoardRoot = document.querySelector('#chessBoard');

// 游戏控制
chessBoardRoot.addEventListener('click',(e) => {
    // 获取落点
    const position = getPosition(e);
    if(!position) return;
    if(position.value && !position.isBacking) {
        console.log('# 落点已下子');
        return;
    }
    // 清空悔棋列表
    if(gameData.backIndex > -1) {
        const chessArrLen = gameData.chessArr.length;
        for(let i = gameData.backIndex; i > -1; i--) {
            const p = gameData.chessArr[0];
            p.value = null;
            p.isBacking = false;
            gameData.chessArr.shift();
        }
        gameData.backIndex = -1;
    }
    // 落子
    position.value = gameData.nowPlayer;
    position.isHover = false;
    // 播放音效
    playAudio('./audio/audio-4.mp3');
    // 检查胜利
    gameData.chessArr.unshift(position);
    const isWin = checkWin(position.x,position.y);
    if(isWin) {
        console.log('胜利啦');
        gameData.gameOver = true;
        playAudio('./audio/audio-2.mp3');
        return;
    }
    // 下一个玩家
    gameData.nowPlayer = -gameData.nowPlayer;
})
let lastHoverPosition;
chessBoardRoot.addEventListener('mousemove',(e) => {
    // console.log(e);
    if(lastHoverPosition) {
        lastHoverPosition.isHover = false;
    }
    const position = getPosition(e);
    if(!position) return;
    if(position.value  && !position.isBacking) {
        return;
    }
    position.isHover = true;
    lastHoverPosition = position;
    // position.value = 1;
    // 修改数据
    // gameData.chessboard


    // 检查胜利
})
chessBoardRoot.addEventListener('mouseleave',(e) => {
    if(lastHoverPosition) {
        lastHoverPosition.isHover = false;
    }
})

/*
 * 按钮控制
 */
const toDomBtn = document.querySelector('#btn1');
const toCanvasBtn = document.querySelector('#btn2');
const backBtn = document.querySelector('#btn3');
const backBackBtn = document.querySelector('#btn4');
const restartBtn = document.querySelector('#restart');
// 切换dom/canvas
toDomBtn.addEventListener('click',()=>{
    gameData.renderMode = 'dom';
})
toCanvasBtn.addEventListener('click',()=>{
    gameData.renderMode = 'canvas';
})
// 悔棋
backBtn.addEventListener('click',()=>{
    if(gameData.backIndex === gameData.chessArr.length-1) return;
    gameData.backIndex += 1;
    gameData.chessArr[gameData.backIndex].isBacking = true;
    gameData.nowPlayer = -gameData.nowPlayer;
})
backBackBtn.addEventListener('click',()=>{
    if(gameData.backIndex <0) return;
    gameData.chessArr[gameData.backIndex].isBacking = false;
    gameData.backIndex -= 1;
    gameData.nowPlayer = -gameData.nowPlayer;
})
// 重新开始
restartBtn.addEventListener('click',()=>{
    location.reload();
})

function getPosition(e){
    // 判断点击点位置
    const pointX = e.offsetX;
    const pointY = e.offsetY;
    const x = getXY(pointX);
    const y = getXY(pointY);
    // 判断位置是否可落子
    const position = gameData.chessboard?.[x]?.[y];
    return position;
}
function getXY(pointXY){
    let x = (pointXY - 20) / 40;
    x = +`0.${x.toString().match(/\.(.*)/)?.[1]}` < 0.5 ? Math.floor(x) : Math.ceil(x);
    return x;
}
function checkWin(x, y){
    const startX = Math.max(0, x - 4);
    const endX = Math.min(x+4, 14);
    const startY = Math.max(0, y - 4);
    const endY = Math.min(14, y + 4);
    let xcount = 0;
    let ycount = 0;
    let xycount = 0;
    let yxcount = 0;
    const c = x - y;
    const nowPlayer = gameData.nowPlayer;
    for(let i = startX; i <= endX; i ++) {
        for(let t = startY; t <= endY; t ++) {
            const position = gameData.chessboard[i][t];
            // → 胜利
            if(t === y && position.value === nowPlayer) {
                if(position.value === nowPlayer){
                    xcount ++;
                }else {
                    xcount = 0;
                }
            }
            // ↓ 胜利
            if(i === x && position.value === nowPlayer) {
                if(position.value === nowPlayer) {
                    ycount ++;
                } else {
                    ycount = 0;
                }
            }
            // ↘ 胜利
            if(i - t === c) {
                if (position.value === nowPlayer) {
                    xycount ++;
                }else {
                    xycount= 0;
                }
            }
            // ↙ 胜利
            if(i - t === (c - 2 * (t - y))) {
                if(position.value === nowPlayer) {
                    yxcount ++;
                }else {
                    yxcount = 0;
                }
            }
            if(xcount >= 5 || ycount >= 5 || xycount >= 5 || yxcount >=5) {
                return true;
            }
        }
    }
    return false;
}
function playAudio(src){
    const audio = document.createElement("audio");
    audio.src = src;
    audio.play();
}
