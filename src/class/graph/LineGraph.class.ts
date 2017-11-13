import { GraphBase } from './graphBase.class';
export class LineGraph extends GraphBase{

  /** 折れ線グラフ中の丸の大きさ */
  public circleSize:number;
  /** 折れ線グラフの線の太さ */
  public lineWidth:number;
  /** 折れ線グラフの線の色 */
  public lineColor:string;
  /** 折れ線グラフの色セット */
  public lineColorSet:string[]
  public circleColorSet:string[]
  /** 折れ線グラフ内文字の色 */
  public textColor:string;
  /** 折れ線グラフ内文字のフォント */
  public textFont:string;
    
  constructor () {
    super();
    this.lineWidth = 1;
    this.lineColor = '#000000';

    this.circleSize = 2;
    this.lineColorSet = this.standardColorSet;
    this.circleColorSet = this.standardColorSet;
    this.textColor = this.standardColorBlack;
    this.textFont = this.standardFontSmall;
  }
}
