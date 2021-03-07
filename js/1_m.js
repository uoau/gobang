export default {
    // 棋盘数据
    nowPlayer: 1, // 当前玩家
    chessArr: [], // 落子数据
    backIndex: -1, // 悔棋序号
    gameOver: false, // 游戏结束
    chessboard: (()=>{
        const arr = [];
        for(let i = 0; i< 15; i++) {
            arr[i] = [];
            for(let t = 0; t<15; t++) {
                arr[i][t] = {
                    value: null, // null 空 1黑 -1白
                    x: i,
                    y: t,
                    isBacking: false, // 悔棋中，用于悔棋和撤销悔棋
                    isHover: false, // 是否是悬停态 
                }
            }
        }
        return arr;
    })(),
    // 游戏渲染模式
    renderMode: 'canvas',
};
