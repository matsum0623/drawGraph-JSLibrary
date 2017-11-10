export class Canvas {
  public width:number;
  public height:number;

  public element_width:number;
  public element_height:number;

  public element:HTMLCanvasElement;

  constructor (canvas_name:string, width:number, height:number) {
    this.element = <HTMLCanvasElement>document.getElementById(canvas_name);
    if (this.element === null) {
      // canvas取得不可時にHTML最後に追加
      const newCanvas = document.createElement('canvas');
      document.body.appendChild(newCanvas);
      this.element = newCanvas;
    }

    this.width = this.element_width = width;
    this.height = this.element_height = height;

  }
}
