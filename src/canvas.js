/* global document */
/**
 * Canvasによるグラフ描画ライブラリ
 * ES2015の機能を使用しているため、IEでは動作しない=>IE時の考慮は未実装
 * 現在は２Dのみの対応
 */
class DrawGraph {
  /**
   * コンストラクタ
   * @param {text} canvas canvasのID
   * @param {int} width   canvasの横幅
   * @param {int} height  canvasの縦幅
   * @returns {void}
   */
  constructor(canvas, width, height) {
    /** 描画データ ******************************************************* */
    this.data = [];
    this.data.drawDataCount = 0;
    this.data.xInterval = 'undefined';
    this.data.yInterval = 'undefined';
    this.data.yCount = [];

    /** CANVASの設定 ***************************************************** */
    this.canvas = [];
    /** canvasの縦横幅の設定 */
    this.canvas.width = typeof width !== 'undefined' ? width : 800;
    this.canvas.height = typeof height !== 'undefined' ? height : 500;

    /** キャンバスの取得(canvasサイズのリサイズ) */
    this.canvas.element = document.getElementById(canvas);
    if (this.canvas.element === null) {
      // canvas取得不可時にHTML最後に追加
      const newCanvas = document.createElement('canvas');
      document.body.appendChild(newCanvas);
      this.canvas.element = newCanvas;
    }
    this.canvas.element.width = this.canvas.width;
    this.canvas.element.height = this.canvas.height;
    // TODO DOM描画前に呼び出されるとエラーとなる現象の回避

    /** 基準線に関わる設定 *********************************************** */
    this.axis = [];
    this.axis.xLineHeight = 'undefined';
    this.axis.color = '#000000';
    this.axis.autoVerticalScaleAdjust = true;

    /** 軸描画用基準点設定（左下を基準点とする） */
    this.axis.opX = 50;
    this.axis.opY = this.canvas.height - 70;
    this.axis.maxX = this.canvas.width - this.axis.opX;
    this.axis.maxY = 50;

    /** 縦軸の単位 */
    this.axis.unitY = 50;
    /** 横軸の単位 */
    this.axis.unitX = 50;
    /** 縦軸の単位記載 */
    this.axis.unitXText = '横軸';
    /** 横軸の単位記載 */
    this.axis.unitYText = '縦軸';


    /** コンテキストの設定 */
    this.ctx = this.canvas.element.getContext('2d');

    /** タイトル関連の設定 *********************************************** */
    this.graphTitle = [];
    /** グラフタイトル */
    this.graphTitle.text = '';
    /** グラフタイトル表示位置(0:上,1:下) */
    this.graphTitle.position = 0;

    /** 文字色 */
    this.textColor = '#000000';
    /** 文字フォント */
    this.textFont = '18px "ＭＳ ゴシック"';
    /** 文字アライメント */
    this.textAlign = 'left';

    /** 直線の幅 */
    this.lineWidth = 1;
    /** 直線の色 */
    this.lineColor = '#000000';
    /** 塗りつぶしの色 */
    this.fillColor = '#000000';
    /** 破線間隔 */
    this.lineDash = {
      no: [0, 0],
      yes: [10, 10],
    };
    /** 破線フラグ */
    this.lineDashFlg = false;

    /** 基準の色セット */
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
    /** 基準色(黒) */
    this.standardColorBlack = '#000000';
    /** 基準色(白) */
    this.standardColorWhite = '#FFFFFF';
    /** 基準の文字フォント */
    this.standardFont = '18px "ＭＳ ゴシック"';
    /** 基準の文字フォント（小文字） */
    this.standardFontSmall = '10px "ＭＳ ゴシック"';

    /** 折れ線グラフの設定 *********************************************** */
    this.lineGraph = [];
    /** 折れ線グラフ中の丸の大きさ */
    this.lineGraph.circleRad = 2;
    /** 折れ線グラフの線の太さ */
    this.lineGraph.LineWidth = 1;
    /** 折れ線グラフの線の色 */
    this.lineGraph.lineColorSet = this.standardColorSet;
    /** 折れ線グラフの色セット */
    this.lineGraph.circleColorSet = this.standardColorSet;
    /** 折れ線グラフ内文字の色 */
    this.lineGraph.textColor = this.standardColorBlack;
    /** 折れ線グラフ内文字のフォント */
    this.lineGraph.textFont = this.standardFontSmall;

    /** 棒グラフの設定 *************************************************** */
    this.barGraph = [];
    /** 棒グラフの幅 */
    this.barGraph.barWidth = 10;
    /** 棒グラフの枠線の色 */
    this.barGraph.barLineColor = this.standardColorBlack;
    /** 棒グラフの塗りつぶしの色 */
    this.barGraph.barFillColor = this.standardColorSet;

    /** 円グラフの設定 *************************************************** */
    this.circleGraph = [];
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

    /** 凡例の設定 ******************************************************* */
    this.legend = [];
    /** 凡例リスト */
    this.legend.textArr = [];
    /** 凡例の文字色 */
    this.legend.textColor = this.standardColorBlack;
    /** 凡例の文字の大きさ */
    this.legend.textFont = this.standardFontSmall;
  }

  // メイン関数 //////////////////////////////////////////////////////////////

  /**
   * 棒グラフを描画
   * @param {arrsy[text,int...]} data グラフデータ
   * @param {arrasy[text...]} legendText  凡例データ
   * @returns {void}
   */
  DrawBarGraph(data, legendText) {
    if (!this.CheckCanvas()) {
      return;
    }
    this.legend.textArr = legendText;

    // データの処理
    const resDataProc = this.dataProcessing(data);
    if (!resDataProc) {
      return;
    }

    // 軸の生成
    this.CreateAxis();

    // グラフの描画
    // 棒グラフの幅調整(隣とかぶる場合のみ)
    if (this.barGraph.barWidth * this.data.drawDataCount >= this.data.xInterval) {
      this.barGraph.barWidth = this.data.xInterval / (this.data.drawDataCount + 1);
    }

    //     基準線との重複を避けるため、下線は基準-0.5、上方へ動かす。
    //     マイナスデータはプラス方向へ動かす。
    for (let i = 0; i < this.data.xCount; i += 1) {
      const xPosition =
        this.axis.opX
         + (this.data.xInterval / 2)
         + (this.data.xInterval * i);
      let yPosition;

      for (let j = 1; j < this.data.drawDataCount + 1; j += 1) {
        // データを基準に合わせて処理
        const yData =
          (this.data.data[i][j] / this.axis.unitY) * this.data.yInterval;
        if (yData > 0) {
          yPosition = this.axis.xLineHeight - 0.5;
        } else {
          yPosition = this.axis.xLineHeight + 0.5;
        }

        this.DrawFillBox(
          (xPosition
            - ((this.data.drawDataCount * this.barGraph.barWidth) / 2))
            + (this.barGraph.barWidth * (j - 1)),
          yPosition,
          this.barGraph.barWidth,
          yData,
          this.barGraph.barFillColor[j - 1],
          this.barGraph.barLineColor,
          false,
        );
      }

      // 文字の描画
      this.DrawFillText(
        xPosition,
        this.axis.xLineHeight + 21,
        this.data.data[i][0],
        'center',
        40,
      );
    }

    this.CreateLegend();
    this.CreateTitle();
  }

  /**
   * 折れ線グラフを描画
   * @param {arrsy[text,int...]} data グラフデータ
   * @param {arrasy[text...]} legendText  凡例データ
   * @returns {void}
   */
  DrawLineGraph(data, legendText) {
    if (!this.CheckCanvas()) {
      return;
    }
    this.legend.textArr = legendText;

    // データの処理
    const resDataProc = this.dataProcessing(data);
    if (!resDataProc) {
      return;
    }

    // 軸の生成
    this.CreateAxis();

    // グラフの描画
    for (let i = 0; i < this.data.xCount; i += 1) {
      const xPosition = this.axis.opX + (this.data.xInterval / 2) + (this.data.xInterval * i);
      const yPosition = this.axis.xLineHeight;

      for (let j = 1; j < this.data.drawDataCount + 1; j += 1) {
        const yData =
          (this.data.data[i][j] / this.axis.unitY) * this.data.yInterval;
        this.DrawFillCircle(
          xPosition,
          yPosition - yData,
          this.lineGraph.circleRad,
          this.lineGraph.circleColorSet[j - 1],
        );

        if (this.data.data[i + 1]) {
          this.DrawLine(
            xPosition,
            yPosition - yData,
            xPosition + this.data.xInterval,
            yPosition - ((this.data.data[i + 1][j] / this.axis.unitY) * this.data.yInterval),
            this.lineWidth,
            this.lineGraph.lineColorSet[j - 1],
          );
        } else {
          this.DrawFillText(
            xPosition + 5,
            (yPosition - yData) + 3,
            this.legend.textArr[j - 1],
            'left',
            40,
            this.lineGraph.textColor,
            this.lineGraph.textFont,
          );
        }
      }

      // 文字の描画
      this.DrawFillText(xPosition, yPosition + 21, this.data.data[i][0], 'center', 40);
    }

    // 凡例の描画
    this.CreateLegend();
    this.CreateTitle();
  }

  /**
   * 円グラフを描画
   * @param {arrsy[text,int...]} data グラフデータ
   * @param {arrasy[text...]} legendText  凡例データ
   * @returns {void}
   */
  DrawCircleGraph(data, legendText) {
    if (!this.CheckCanvas()) {
      return;
    }
    this.legend.textArr = legendText;

    // 円グラフのそれぞれの割合の計算
    let dataSum = 0;
    for (let i = 0; i < data.length; i += 1) {
      dataSum += data[i][1];
    }
    // 円グラフ描画
    let startAng = 0;
    for (let i = 0; i < data.length; i += 1) {
      this.DrawFillFan(
        this.circleGraph.xp,
        this.circleGraph.yp,
        this.circleGraph.rad,
        startAng,
        startAng + (Math.PI * 2 * (data[i][1] / dataSum)),
        this.circleGraph.fillColor[i],
      );

      if (data[i][1] / dataSum > this.circleGraph.textDrawMinDataRatio) {
        // 描画位置の計算
        const textDrawAng = startAng + (Math.PI * (data[i][1] / dataSum));
        const textX = this.circleGraph.xp
          + (Math.sin(textDrawAng)
            * this.circleGraph.rad
            * this.circleGraph.TextDrawRadRatio);
        const textY = this.circleGraph.yp
          - (Math.cos(textDrawAng)
            * this.circleGraph.rad
            * this.circleGraph.TextDrawRadRatio);
        this.DrawFillBox(textX - 18, textY, 36, 18, this.standardColorWhite);
        this.DrawFillText(textX, textY + 16, data[i][1], 'center', 50);
      }

      // 次データのスタート位置調整
      startAng += (2 * Math.PI * (data[i][1] / dataSum));
    }

    // 凡例の描画
    this.CreateLegend();
    this.CreateTitle();
  }

  // 内部関数 ///////////////////////////////////////////////////////////////
  /**
   * 直線を追加
   * @param {int} x1  開始点X
   * @param {int} y1  開始点Y
   * @param {int} x2  終了点X
   * @param {int} y2  終了点Y
   * @param {int} lineWidth   線の太さ
   * @param {String} lineColor    線の色
   * @param {bool} lineDashFlg    点線フラグ
   * @returns {void}
   */
  DrawLine(x1, y1, x2, y2, _lineWidth, _lineColor, _lineDashFlg) {
    const lineWidth = typeof _lineWidth !== 'undefined' ? _lineWidth : this.lineWidth;
    const lineColor = typeof _lineColor !== 'undefined' ? _lineColor : this.lineColor;
    const lineDashFlg = typeof _lineDashFlg !== 'undefined' ? _lineDashFlg : this.lineDashFlg;

    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = lineColor;
    if (lineDashFlg !== true) {
      this.ctx.setLineDash(this.lineDash.no);
    } else {
      this.ctx.setLineDash(this.lineDash.yes);
    }
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.closePath();
    this.ctx.stroke();

    this.resetDrawConf();
  }

  /**
   * 塗りつぶした正円を追加
   * @param {int} x         中心のX座標
   * @param {int} y         中心のY座標
   * @param {int} rad       円の半径
   * @param {String} fillColor  塗りつぶしの色
   * @param {boolean} flg   基準フラグ（true：左上、false：左下）
   * @returns {void}
   */
  DrawFillCircle(x, _y, rad, _fillColor, _flg) {
    const fillColor = typeof _fillColor !== 'undefined' ? _fillColor : this.fillColor;
    const flg = typeof _flg !== 'undefined' ? _flg : true;
    const y = (!flg) ? this.canvas.height - _y : _y;
    this.ctx.beginPath();
    this.ctx.arc(x, y, rad, 0, Math.PI * 2, true);
    this.ctx.fillStyle = fillColor;
    this.ctx.strokeStyle = fillColor;
    this.ctx.stroke();
    this.ctx.fill();

    this.resetDrawConf();
  }

  /**
   * 塗りつぶした扇形を作成
   * 基準点は真上に修正される
   * @param {double} x
   * @param {double} y
   * @param {double} rad
   * @param {float} startAng
   * @param {float} endAng
   * @param {String} fillColor
   * @returns {undefined}
   */
  DrawFillFan(x, y, rad, _startAng, _endAng, _fillColor) {
    const fillColor = typeof _fillColor !== 'undefined' ? _fillColor : this.fillColor;

    const startAng = _startAng - (Math.PI / 2);
    const endAng = _endAng - (Math.PI / 2);

    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.arc(x, y, rad, startAng, endAng, false);
    this.ctx.fillStyle = fillColor;
    this.ctx.fill();

    this.resetDrawConf();
  }

  /**
   * 塗りつぶした四角形を描画する
   * @param {double} x      始点のX座標
   * @param {double} y      始点のY座標
   * @param {double} width  四角形の幅
   * @param {double} height 四角形の高さ
   * @param {String} fillColor 塗りつぶしの色
   * @param {String} lineColor ラインの色
   * @param {bool} flg    基準フラグ（true：左上、false：左下）
   * @returns {void}
   */
  DrawFillBox(x, y, width, _height, _fillColor, _lineColor, _flg) {
    const fillColor = typeof _fillColor !== 'undefined' ? _fillColor : this.fillColor;
    const lineColor = typeof _lineColor !== 'undefined' ? _lineColor : this.lineColor;
    const flg = typeof _flg !== 'undefined' ? _flg : true;
    const height = (!flg) ? -1 * _height : _height;
    this.ctx.strokeStyle = lineColor;
    this.ctx.fillStyle = fillColor;
    this.ctx.beginPath();
    this.ctx.fillRect(x, y, width, height);
    this.ctx.stroke();
    this.ctx.fill();

    this.resetDrawConf();
  }

  /**
   * 四角形を描画
   * @param {double} x    基準点のX座標
   * @param {double} y    基準点のY座標
   * @param {double} width    図形の横幅
   * @param {double} height   図形の縦幅
   * @param {String} lineColor    ラインの色
   * @param {bool} flg    基準フラグ（true：左上、false：左下）
   * @returns {void}
   */
  DrawBox(x, y, width, _height, _lineColor, _flg) {
    const lineColor = typeof _lineColor !== 'undefined' ? _lineColor : this.lineColor;
    const flg = typeof _flg !== 'undefined' ? _flg : true;
    const height = (flg) ? _height : -1 * _height;
    this.ctx.strokeStyle = lineColor;
    this.ctx.beginPath();
    this.ctx.strokeRect(x, y, width, height);
    this.ctx.stroke();

    this.resetDrawConf();
  }

  /**
   * テキストを描画
   * @param {double} x    基準点のX座標
   * @param {double} y    基準点のY座標
   * @param {String} text 描画するテキスト
   * @param {double} maxLength    最大幅
   * @param {String} textColor    文字色
   * @param {String} textFont     文字フォント
   * @returns {void}
   */
  DrawFillText(x, y, text, _textAlign, maxLength, _textColor, _textFont) {
    const textColor = typeof _textColor !== 'undefined' ? _textColor : this.textColor;
    const textFont = typeof _textFont !== 'undefined' ? _textFont : this.textFont;
    const textAlign = typeof _textAlign !== 'undefined' ? _textAlign : this.textAlign;

    this.ctx.fillStyle = textColor;
    this.ctx.font = textFont;
    this.ctx.textAlign = textAlign;
    this.ctx.fillText(text, x, y, maxLength);

    this.resetDrawConf();
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
  CreateAxis(
    _axisColor,
    _opX,
    _opY,
    _maxX,
    _maxY,
    _unitX,
    _unitY,
    _yCount,
    _unitXText,
    _unitYText,
  ) {
    // 描画色の設定
    const axisColor = typeof _axisColor !== 'undefined' ? _axisColor : this.axis.color;

    const opX = typeof _opX !== 'undefined' ? _opX : this.axis.opX;
    const opY = typeof _opY !== 'undefined' ? _opY : this.axis.opY;
    const maxX = typeof _maxX !== 'undefined' ? _maxX : this.axis.maxX;
    const maxY = typeof _maxY !== 'undefined' ? _maxY : this.axis.maxY;

    const unitX = typeof _unitX !== 'undefined' ? _unitX : this.axis.unitX;
    const unitY = typeof _unitY !== 'undefined' ? _unitY : this.axis.unitY;

    const yCount = typeof _yCount !== 'undefined' ? _yCount : this.data.yCount;

    const unitXText = typeof _unitXText !== 'undefined' ? _unitXText : this.axis.unitXText;
    const unitYText = typeof _unitYText !== 'undefined' ? _unitYText : this.axis.unitYText;

    // 縦軸描画
    this.DrawLine(opX, opY, opX, maxY, 1, axisColor);
    let tmpY = opY;
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

  /**
   * 凡例の作成
   * @param {array[string...]} legendText 凡例データ
   * @param {array[string...]} fillColor    凡例用色データ
   * @returns {void}
   */
  CreateLegend(_legendText, _fillColor) {
    const legendText = typeof _legendText !== 'undefined' ? _legendText : this.legend.textArr;
    const fillColor = typeof _fillColor !== 'undefined' ? _fillColor : this.standardColorSet;
    if (!legendText) {
      return;
    }
    const legendCount = legendText.length;
    const tmpX = this.canvas.width - (legendCount * 60) - 10;
    const tmpY = this.canvas.height - 40;
    this.DrawBox(tmpX, tmpY, (legendCount * 60), 30, this.standardColorBlack, true);

    for (let i = 0; i < legendCount; i += 1) {
      this.DrawFillBox(tmpX + (i * 60) + 10, tmpY + 9, 12, 12, fillColor[i], fillColor[i], true);
      this.DrawFillText(tmpX + (i * 60) + 24, tmpY + 18, legendText[i], 'left', 50, this.legend.textColor, this.standardFontSmall);
    }
  }

  /**
   * タイトルの作成
   * @param {String} title    タイトルテキスト
   * @param {int} titlePosition   表示位置フラグ
   * @return {void}
   */
  CreateTitle(_title, _position) {
    const title = typeof _title !== 'undefined' ? _title : this.graphTitle.text;
    const position = typeof _position !== 'undefined' ? _position : this.graphTitle.position;

    this.DrawFillText(
      this.canvas.width / 2,
      position === 0 ? 20 : this.canvas.height - 20,
      title,
      'center',
    );
  }

  /**
   * canvas要素の取得チェック
   * @returns {Boolean}
   */
  CheckCanvas() {
    if (this.canvas.element === null || !this.canvas.element.getContext) {
      return false;
    }
    return true;
  }

  /**
   * 描画設定の解除
   */
  resetDrawConf() {
    this.ctx.fillStyle = this.textColor;
    this.ctx.font = this.textFont;
    this.ctx.textAlign = this.textAlign;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.strokeStyle = this.lineColor;
    // 破線フラグ解除
    this.ctx.setLineDash(this.lineDash.no);
    // 描画色デフォルト
    this.ctx.strokeStyle = this.lineColor;
  }

  /**
   * 棒グラフ、折れ線グラフ用 データ処理部共通化
   * @param {array} 描画データ
   * @return {array} 描画データ＋[drawDataCount:描画データ数,xInterval:x軸の間隔,yInterval:Y軸の間隔,xLineHeightx軸の描画高さ]
   */
  dataProcessing(data) {
    if (data === null || data === '') {
      return false;
    }
    // データの登録
    this.data.data = data;
    // グラフ間隔の計算(X軸)
    this.data.xCount = this.data.data.length;
    this.data.xInterval = (this.axis.maxX - this.axis.opX) / this.data.xCount;

    // 1グループのデータ数の取得
    this.data.drawDataCount = data[0].length - 1;

    // Y軸最大値計算用
    this.data.maxYdata = 0;
    for (let i = 0; i < this.data.xCount; i += 1) {
      for (let j = 1; j < this.data.drawDataCount + 1; j += 1) {
        // Y軸最大値の再計算
        if (this.data.maxYdata < this.data.data[i][j]) {
          this.data.maxYdata = this.data.data[i][j];
        }
      }
    }
    // Y軸最小値計算用(最小値がプラスの場合には0)
    this.data.minYdata = 0;
    for (let i = 0; i < this.data.xCount; i += 1) {
      for (let j = 1; j < this.data.drawDataCount + 1; j += 1) {
        // Y軸最小値の再計算
        if (this.data.minYdata > this.data.data[i][j]) {
          this.data.minYdata = this.data.data[i][j];
        }
      }
    }

    // Y軸基準描画間隔の再計算
    if (this.data.maxYdata - this.data.minYdata
        > this.axis.unitY * 10 && this.axis.autoVerticalScaleAdjust) {
      // 縦軸目盛自動調整
      this.axis.unitY = 10 ** (String(this.data.maxYdata - this.data.minYdata).length - 1);
    }

    // プラス方向、マイナス方向の基準数の設定
    this.data.yCount.plus =
      Math.ceil(this.data.maxYdata / this.axis.unitY);
    this.data.yCount.minus =
      Math.ceil(((-1) * this.data.minYdata) / this.axis.unitY);

    this.data.yInterval =
      Math.abs(this.axis.maxY - this.axis.opY)
        / (this.data.yCount.plus + this.data.yCount.minus);
    // 横軸描画高さを計算
    this.axis.xLineHeight =
      this.axis.opY - (this.data.yCount.minus * this.data.yInterval);

    return true;
  }
}
