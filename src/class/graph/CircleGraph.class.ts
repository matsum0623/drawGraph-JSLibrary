import { GraphBase } from './graphBase.class';
export class CircleGraph extends GraphBase{
  /** 中心点のX座標 */
  public xp:number;
  /** 中心点のY座標 */
  public yp:number;
  /** 円グラフの半径 */
  public rad:number;
  /** 円グラフの塗りつぶしの色 */
  public fillColor:string[];
  /** 円グラフデータ描画位置(半径の何割の位置か) */
  public textDrawRadRatio:number;
  /** 円グラフのデータ描画最小割合 */
  public textDrawMinDataRatio:number;
  constructor (canvasWidth:number, canvasHeight:number) {
    super();
    this.xp = canvasWidth / 2;
    /** 中心点のY座標 */
    this.yp = canvasHeight / 2;
    /** 円グラフの半径 */
    this.rad = (canvasWidth < canvasHeight ? canvasWidth : canvasHeight) * 0.35;
    /** 円グラフの塗りつぶしの色 */
    this.fillColor = this.standardColorSet;
    /** 円グラフデータ描画位置(半径の何割の位置か) */
    this.textDrawRadRatio = 0.7;
    /** 円グラフのデータ描画最小割合 */
    this.textDrawMinDataRatio = 0.01;
  }
}

/** 中心点のX座標 */
this.circleGraph.xp = this.canvas.width / 2;
/** 中心点のY座標 */
this.circleGraph.yp = this.canvas.height / 2;
/** 円グラフの半径 */
this.circleGraph.rad =
  this.canvas.width < this.canvas.height ?
    this.canvas.width * 0.35 : this.canvas.height * 0.35;
/** 円グラフの塗りつぶしの色 */
this.circleGraph.fillColor = this.standardColorSet;
/** 円グラフデータ描画位置(半径の何割の位置か) */
this.circleGraph.TextDrawRadRatio = 0.7;
/** 円グラフのデータ描画最小割合 */
this.circleGraph.textDrawMinDataRatio = 0.01;
