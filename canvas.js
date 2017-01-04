/**
 * Canvasによるグラフ描画ライブラリ
 * ES2015の機能を使用しているため、IEでは動作しない=>IE時の考慮は未実装
 */
class drawGraph{
    /**
     * 
     * @param {type} width
     * @param {type} height
     * @param {type} id 
     * @returns {drawGraph}
     */
    constructor(id,width,height){
        // パラメータの用意
        this.id = id;
        this.width = width;
        this.height = height;
    }
    /**
     * 棒グラフを描画
     * @returns {type} 
     */
    drawBarGraph(){}
    /**
     * 折れ線グラフを描画
     */
    drawLineGraph(){}
    /**
     * 円グラフを描画
     */
    drawCircleGraph(){}
}
