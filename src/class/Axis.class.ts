export class Axis {
  /** キャンバスの高さ */
  public canvas_height:number;
  /** キャンバスの幅 */
  public canvas_width:number;

  public xLineHeight:Number;
  public color:string;
  public autoVerticalScaleAdjust:Boolean;
  public opX:number;
  public opY:number;
  public maxX:Number;
  public maxY:Number;
  /** 横軸の単位 */
  public unitX:number;
  /** 縦軸の単位 */
  public unitY:number;
  /** 横軸の単位表記 */
  public unitXText:string;
  /** 縦軸の単位表記 */
  public unitYText:string;

  /** 左横の余白 */
  public offset_left:number;
  /** 右横の余白 */
  public offset_right:number;
  /** 上の余白 */
  public offset_top:number;
  /** 下の余白 */
  public offset_bottom:number;

  constructor (canvas_width,canvas_height) {
    this.canvas_width = canvas_width;
    this.canvas_height = canvas_height;

    this.xLineHeight = null;
    this.color = '#000000';
    this.autoVerticalScaleAdjust = true;
    this.unitX = 50;
    this.unitY = 50;
    this.unitXText = '横軸';
    this.unitYText = '縦軸';

    this.offset_top = 50;
    this.offset_bottom = 50;
    this.offset_right = 50;
    this.offset_left = 50;

    this.resetOption();
  }

  private resetOption (){
    this.opX = this.offset_left;
    this.opY = this.canvas_height - this.offset_bottom;
    this.maxX = this.canvas_width - this.offset_right;
    this.maxY = this.offset_top;
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
}
