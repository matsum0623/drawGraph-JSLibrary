import { CanvasBase } from './lib/CanvasBase.lib';

export class Axis {
  /** 2Dコンテキスト */
  public ctx:CanvasRenderingContext2D;
  /** キャンバスの高さ */
  public canvasHeight:number;
  /** キャンバスの幅 */
  public canvasWidth:number;

  public xLineHeight:Number;
  public color:string;
  public autoVerticalScaleAdjust:Boolean;
  /** 基準点のX座標 */
  public opX:number;
  /** 基準点のY座標 */
  public opY:number;
  /** 最大値のX座標 */
  public maxX:number;
  /** 最大値のY座標 */
  public maxY:number;
  /** 横軸の単位 */
  public unitX:number;
  /** 縦軸の単位 */
  public unitY:number;
  /** 横軸の単位表記 */
  public unitXText:string;
  /** 縦軸の単位表記 */
  public unitYText:string;

  /** 左横の余白 */
  public offsetLeft:number;
  /** 右横の余白 */
  public offsetRight:number;
  /** 上の余白 */
  public offsetTop:number;
  /** 下の余白 */
  public offsetBottom:number;

  /** 文字色 */
  public textColor:string;
  /** 文字フォント */
  public textFont:string;
  /** 文字アライメント */
  public textAlign:string;

  constructor (ctx:CanvasRenderingContext2D, canvasWidth:number, canvasHeight:number) {
    this.ctx = ctx;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.xLineHeight = null;
    this.color = '#000000';
    this.autoVerticalScaleAdjust = true;
    this.unitX = 50;
    this.unitY = 50;
    this.unitXText = '横軸';
    this.unitYText = '縦軸';

    this.offsetTop = 50;
    this.offsetBottom = 50;
    this.offsetRight = 50;
    this.offsetLeft = 50;

    this.resetOption();

    this.textColor = '#000000';
    this.textFont = '18px "ＭＳ ゴシック"';
    this.textAlign = 'left';
    
  }

  private resetOption () {
    this.opX = this.offsetLeft;
    this.opY = this.canvasHeight - this.offsetBottom;
    this.maxX = this.canvasWidth - this.offsetRight;
    this.maxY = this.offsetTop;
  }

  public setUnit (unitX:number, unitY:number) {
    this.setUnitX(unitX);
    this.setUnitY(unitY);
  }

  public setUnitX (unitX:number) {
    this.unitX = unitX;
  }

  public setUnitY (unitY:number) {
    this.unitY = unitY;
  }

  public setUnitText (unitXText:string, unitYText:string) {
    this.setUnitXText(unitXText);
    this.setUnitYText(unitYText);
  }

  public setUnitXText (unitXText:string) {
    this.unitXText = unitXText;
  }

  public setUnitYText (unitYText:string) {
    this.unitYText = unitYText;
  }

  /**
   * 縦軸/横軸を描画
   * @param {text} axisColor 軸の色
   * @param {double} opX 基準点のX位置
   * @param {double} opY 基準点のY位置
   * @param {double} maxX X軸の最大位置
   * @param {double} maxY Y軸の最大位置
   * @param {double} unitX X軸の単位間隔
   * @param {double} unitY Y軸の単位間隔
   * @param {array(double)} yCount Y軸の単位個数[プラス方向 , マイナス方向]
   * @param {String} unitXText X軸の単位表記
   * @param {String} unitYText Y軸の単位表記
   * @returns {void}
   */
  public createAxis() {
    const canvasBaseClass = new CanvasBase(this.ctx);
    // 縦軸描画
    canvasBaseClass.drawLine(this.opX, this.opY, this.opX, this.maxY);
    let tmpY = this.opY;
    // マイナスデータがない場合には描画しない
    if (yCount.minus > 0) {
      // 縦軸単位線描画
      tmpY = opY - unitY;
      // 縦軸単位線（マイナス方向）
      for (let i = yCount.minus - 1; i > 0; i -= 1) {
        // 基準点描画
        this.DrawLine(opX - 3, Math.round(tmpY), opX + 3, Math.round(tmpY), 1, axisColor);
        // 基準単位描画
        this.DrawFillText(opX - 4, Math.round(tmpY) + 6, (-1) * this.axis.unitY * i, 'right');
        // 基準線描画
        this.DrawLine(
          opX + 4,
          Math.round(tmpY),
          this.axis.maxX,
          Math.round(tmpY),
          0.5,
          this.axis.color,
          true,
        );
        tmpY -= unitY;
      }
    }

    // 横軸描画
    this.DrawLine(opX, tmpY, maxX, tmpY, 1, axisColor);
    // 横軸単位線描画
    let tmpX = opX + (unitX / 2);
    while (tmpX < maxX) {
      // 基準点描画
      this.DrawLine(tmpX, tmpY - 3, tmpX, tmpY + 3, 1, axisColor);
      tmpX += unitX;
    }
    // 横軸単位表記描画
    this.DrawFillText(maxX, this.canvas.height - 50, unitYText, 'left');

    // 基準単位描画(X軸)
    this.DrawFillText(opX - 4, Math.round(tmpY) + 6, '0', 'right');

    // 描画位置を1ユニット進める
    tmpY -= unitY;

    // 縦軸単位線（プラス方向）
    for (let i = 1; i <= yCount.plus - 1; i += 1) {
      // 基準点描画
      this.DrawLine(opX - 3, Math.round(tmpY), opX + 3, Math.round(tmpY), 1, axisColor);
      // 基準単位描画
      this.DrawFillText(opX - 4, Math.round(tmpY) + 6, this.axis.unitY * i, 'right');
      // 基準線描画
      this.DrawLine(
        opX + 4,
        Math.round(tmpY),
        this.axis.maxX,
        Math.round(tmpY),
        0.5,
        this.axis.color,
        true,
      );
      tmpY -= unitY;
    }
    // 縦軸単位表記描画
    this.DrawFillText(30, 30, unitXText, 'left');
  }
}
