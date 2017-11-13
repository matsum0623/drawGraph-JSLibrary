export class CanvasBase {

  private ctx:CanvasRenderingContext2D;

  constructor (ctx:CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
  
  public drawLine(x1:number, y1:number, x2:number, y2:number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.closePath();
    this.ctx.stroke();
  }

  public drawFillText(text:string, x:number ,y:number, maxLength:number) {
    this.ctx.fillText(text, x, y, maxLength);    
  }

  public drawFillCircle(x:number, y:number, rad:number) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, rad, 0, Math.PI * 2, true);
    this.ctx.stroke();
    this.ctx.fill();
  }

  public drawFillFan(x:number, y:number, rad:number, startAng:number, endAng:number) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.arc(x, y, rad, startAng, endAng, false);
    this.ctx.fill();
  }

  public drawBox(x:number, y:number, width:number, height:number) {
    this.ctx.beginPath();
    this.ctx.strokeRect(x, y, width, height);
    this.ctx.stroke();
  }

  public drawFillBox(x:number, y:number, width:number, height:number) {
    this.ctx.beginPath();
    this.ctx.fillRect(x, y, width, height);
    this.ctx.stroke();
    this.ctx.fill();
  }
}
