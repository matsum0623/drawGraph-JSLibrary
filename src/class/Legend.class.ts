export class Legend {
  /** 凡例リスト */
  public textArray:string[];
  /** 凡例の文字色 */
  public textColor:string;
  /** 凡例の文字の大きさ */
  public textFont:string;
  constructor () {
    this.textArray = [];
    this.textColor = '#000000';
    this.textFont = '10px "ＭＳ ゴシック"';
  }
}
