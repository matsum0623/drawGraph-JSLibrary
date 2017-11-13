export class Title {
  /** グラフタイトル */
  public text:string;
  /** グラフタイトル表示位置(0:上,1:下) */
  public positionFlag:number;

  constructor () {
    this.text = '';
    this.positionFlag = 0;
  }

}
