import gameData from './1_m.js';
const chessBoardRoot = document.querySelector('#chessBoard');

window.gameData = gameData;

// 深监听
function deepProxy(obj, cb){
    if(obj === null) return;
    if (typeof obj === 'object') {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                obj[key] = deepProxy(obj[key], cb);
            }
        }
    }
    return new Proxy(obj, {
        set: function (target, key, value, receiver) {
            if (typeof value === 'object') {
                value = deepProxy(value, cb);
            }
            const res = Reflect.set(target, key, value, receiver);
            let cbType = target[key] == undefined ? 'create' : 'modify';
            if (!(Array.isArray(target) && key === 'length')) {
                cb(cbType, { target, key, value });
            }
            return res;
        },
        deleteProperty(target, key) {
            cb('delete', { target, key });
            return Reflect.deleteProperty(target, key);
        }
    })
}

// 改变视图
function changeView(){
    if(gameData.renderMode === 'dom'){
        renderDom();        
    }else {
        renderCanvas();
    }
    // 顺便操控ui
    renderUi();
}

// 渲染dom
function renderDom(){
    const newDom = document.createElement('div');
    const canvas = chessBoardRoot.querySelector('canvas');
    if(canvas){
        chessBoardRoot.removeChild(canvas);
    }
    // 绘制棋盘
    for(let i = 0; i< 15; i++) {
        // 画线
        const xLine = document.createElement('div');
        xLine.style.width = `${40*14}px`;
        xLine.style.height = '1px';
        xLine.style.background = '#593024';
        xLine.style.position = 'absolute';
        xLine.style.left = '20px';
        xLine.style.top = `${20 + (i * 40)}px`;
        newDom.appendChild(xLine);
        for(let t = 0; t < 15; t++) {
            // 画线
            const yLine = document.createElement('div');
            yLine.style.height = `${40*14}px`;
            yLine.style.width = '1px';
            yLine.style.background = '#593024';
            yLine.style.position = 'absolute';
            yLine.style.top = '20px';
            yLine.style.left = `${20 + t * 40}px`;
            newDom.appendChild(yLine);
            // 画四个点
            if((i === 3 && t === 3) || (i === 3 && t === 11) || (i === 11 && t === 3) || (i === 11 && t === 11)) {
                const point = document.createElement('div');
                point.style.height = `6px`;
                point.style.width = '6px';
                point.style.background = '#593024';
                point.style.position = 'absolute';
                point.style.borderRadius = '50%';
                point.style.left = `${20 + i * 40 - 3}px`;
                point.style.top = `${20 + t * 40 - 3}px`;
                newDom.appendChild(point);
            }
        }
    }
    // 绘制棋子
    for(let i = 0; i< 15; i++) {
        for(let t = 0; t < 15; t++) {
            const position = gameData.chessboard[i][t];
            if(position.value === -1 || position.value === 1) {
                // 画棋子
                const chess = document.createElement('div');
                chess.style.width = '40px';
                chess.style.height = '40px';
                chess.style.background = position.value === 1 ? 'url(./imgs/img-3.png)' : 'url(./imgs/img-4.png)';
                chess.style.backgroundSize = '100% 100%';
                chess.style.position = 'absolute';
                chess.style.borderRadius = '50%';
                chess.style.left = `${20 + i * 40 - 20}px`;
                chess.style.top = `${20 + t * 40 - 20}px`;
                newDom.appendChild(chess);
            }
            if(position.isHover) {
                // 画悬停框
                const hoverImg = document.createElement('div');
                hoverImg.style.width = '40px';
                hoverImg.style.height = '40px';
                hoverImg.style.background = position.value === 1 ? 'url(./imgs/img-10.png)' : 'url(./imgs/img-11.png)';
                hoverImg.style.backgroundSize = '100% 100%';
                hoverImg.style.position = 'absolute';
                hoverImg.style.left = `${20 + i * 40 - 20}px`;
                hoverImg.style.top = `${20 + t * 40 - 20}px`;
                newDom.appendChild(hoverImg);
            }
        }
    }
    const oldDom = chessBoardRoot.querySelector('div');
    if(oldDom){
        chessBoardRoot.replaceChild(newDom, oldDom);
    }else {
        chessBoardRoot.appendChild(newDom);
    }
    // 没做diff，所有打开控制台会卡
}

// 渲染canvas
let blackChess;
let whiteChess;
let blackHover;
let whiteHover;
(async ()=>{
    blackChess = await loadImg('./imgs/img-3.png');
    whiteChess = await loadImg('./imgs/img-4.png');
    blackHover = await loadImg('./imgs/img-10.png');
    whiteHover = await loadImg('./imgs/img-11.png');
})();
function renderCanvas(){
    const oldDom = chessBoardRoot.querySelector('div');
    if(oldDom) {
        chessBoardRoot.removeChild(oldDom);
    }
    let canvas = chessBoardRoot.querySelector('canvas');
    let isNewCanvas = false;
    if(!canvas) {
        isNewCanvas = true;
        canvas = document.createElement('canvas');
    }
    canvas.width = 1200;
    canvas.height = 1200;
    canvas.style.transform = 'scale(0.5)';
    canvas.style.transformOrigin = 'top left';
    const ctx = canvas.getContext("2d");
    const newDom = document.createElement('div');
    // 绘制棋盘
    for(let i = 0; i< 15; i++) {
        // 画横线
        ctx.fillStyle="#593024";
        ctx.beginPath();
        ctx.fillRect(40, 40 + (i * 80), 80*14, 2);
        ctx.closePath();
        ctx.fill();
        for(let t = 0; t < 15; t++) {
            // 画线
            ctx.fillStyle="#593024";
            ctx.beginPath();
            ctx.fillRect(40 + (t* 80), 40, 2, 80*14);
            ctx.closePath();
            ctx.fill();
            // 画四个点
            if((i === 3 && t === 3) || (i === 3 && t === 11) || (i === 11 && t === 3) || (i === 11 && t === 11)) {
                ctx.fillStyle="#593024";
                ctx.beginPath();
                ctx.arc(40 + i * 80, 40 + t * 80,6,Math.PI*2,0,true);
                ctx.closePath();
                ctx.fill();
            }
        }
    }
    // 绘制棋子
    for(let i = 0; i< 15; i++) {
        for(let t = 0; t < 15; t++) {
            const position = gameData.chessboard[i][t];
            if((position.value === -1 || position.value === 1) && !position.isBacking) {
                // 画棋子
                if(!blackChess || !whiteChess) return;
                const chessImg = position.value === 1 ? blackChess : whiteChess;
                ctx.drawImage(chessImg,i * 80,t * 80, 80, 80);
            }
            if(position.isHover) {
                // 画悬停框
                if(!blackHover || !whiteHover) return;
                const hoverImg = gameData.nowPlayer === 1 ? blackHover : whiteHover;
                ctx.drawImage(hoverImg,i * 80,t * 80, 80, 80);
            }
        }
    }

    if(isNewCanvas){
        chessBoardRoot.appendChild(canvas);
    }
}

// 渲染ui
const toDomBtn = document.querySelector('#btn1');
const toCanvasBtn = document.querySelector('#btn2');
const backBtn = document.querySelector('#btn3');
const backBackBtn = document.querySelector('#btn4');
const player1 = document.querySelector('#player1');
const player2 = document.querySelector('#player2');
const winDialog = document.querySelector('#winDialog');
function renderUi(){
    // 控制按钮显示
    if(gameData.renderMode === 'canvas'){
        toDomBtn.style.display = 'inline-flex';
        toCanvasBtn.style.display = 'none';
    } else {
        toCanvasBtn.style.display = 'inline-flex';
        toDomBtn.style.display = 'none';
    }
    // 控制悔棋
    if(gameData.chessArr.length > 0) {
        backBtn.style.display = 'inline-flex';
        backBackBtn.style.display = 'inline-flex';
    }else {
        backBtn.style.display = 'none';
        backBackBtn.style.display = 'none';
    }
    // 控制角色
    if(gameData.nowPlayer === 1){
        player1.classList.add('active');
        player2.classList.remove('active');
    }else {
        player2.classList.add('active');
        player1.classList.remove('active');
    }
    // 游戏结束
    if(gameData.gameOver) {
        winDialog.querySelector(`.p${gameData.nowPlayer === 1 ? '1': '2'}`)?.classList.add('active');
        winDialog.style.display = 'flex';
    }
}

changeView();
export default deepProxy(gameData, (type, { target, key })=>{
    // console.log('# gameData变化', type, target, key);
    changeView();
});;


function loadImg(src){
    return new Promise((resolve)=>{
        const img = new Image();
        img.onload = function(){
            resolve(img);
        }
        img.src = src;
    })    
}