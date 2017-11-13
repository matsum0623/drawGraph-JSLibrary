export class GraphBase {

  /** 基準の色セット */
  public standardColorSet:string[];
  /** 基準色(黒) */
  public standardColorBlack:string;
  /** 基準色(白) */
  public standardColorWhite:string;
  /** 基準の文字フォント */
  public standardFont:string;
  /** 基準の文字フォント（小文字） */
  public standardFontSmall:string;

  constructor () {
    this.standardColorSet = [
      '#FF2800', // 赤
      '#FAF500', // 黄色
      '#35A16B', // 緑
      '#0041FF', // 青
      '#66CCFF', // 空色
      '#FF99A0', // ピンク
      '#FF9900', // オレンジ
      '#9A0079', // 紫
      '#663300', // 茶
      '#FFD1D1', // 明るいピンク
      '#FFFF99', // クリーム
      '#CBF266', // 明るい黄緑
      '#B4EBFA', // 明るい空色
      '#EDC58F', // ベージュ
      '#87E7B0', // 明るい緑
      '#C7B2DE', // 明るい紫
    ];
    this.standardColorBlack = '#000000';
    this.standardColorWhite = '#FFFFFF';
    this.standardFont = '18px "ＭＳ ゴシック"';
    this.standardFontSmall = '10px "ＭＳ ゴシック"';
  }
}
