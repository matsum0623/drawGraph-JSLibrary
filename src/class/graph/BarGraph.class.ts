import { GraphBase } from './graphBase.class';
export class barGraph extends GraphBase{

  /** 棒グラフの幅 */
  public barWidth:number;
  /** 棒グラフの枠線の色 */
  public barLineColor:string;
  /** 棒グラフの塗りつぶしの色 */
  public barFillColor:string[];

  constructor () {
    super();
    /** 棒グラフの幅 */
    this.barWidth = 10;
    /** 棒グラフの枠線の色 */
    this.barLineColor = this.standardColorBlack;
    /** 棒グラフの塗りつぶしの色 */
    this.barFillColor = this.standardColorSet;
  }
}
