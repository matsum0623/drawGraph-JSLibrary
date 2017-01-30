/**
 * Canvasによるグラフ描画ライブラリ
 * ES2015の機能を使用しているため、IEでは動作しない=>IE時の考慮は未実装
 * 現在は２Dのみの対応
 */
class DrawGraph{

    /**
     * コンストラクタ
     * @param {text} canvas canvasのID
     * @param {int} width   canvasの横幅
     * @param {int} height  canvasの縦幅
     * @returns {void}
     */
    constructor(canvas,width,height){
        /** canvasの縦横幅の設定 */
        this.width  = typeof width  !== 'undefined' ? width  : 800;
        this.height = typeof height !== 'undefined' ? height : 500;
        
        /** キャンバスの取得(canvasサイズのリサイズ) */
        this.canvas = document.getElementById(canvas);
        if(this.canvas === null){
            // canvas取得負荷時にHTML最後に追加
            const newCanvas = document.createElement('canvas');
            document.body.appendChild(newCanvas);
            this.canvas = newCanvas;
        }
        this.canvas.width = this.width;
        this.canvas.height = this.height;
// TODO DOM描画前に呼び出されるとエラーとなる現象の回避

        /** コンテキストの設定 */
        this.ctx = this.canvas.getContext('2d');
        
        /** グラフタイトル */
        this.titleText = "";
        /** グラフタイトル表示位置(0:上,1:下) */
        this.titlePosition = 0;
        
        /** 軸描画用基準点設定（左下を基準点とする）*/
        this.opX  = 50;                     // 基準点X
        this.opY  = this.height - 70;       // 基準点Y
        this.maxX = this.width  - this.opX; // 最大X
        this.maxY = 50;                     // 最大Y
        
        /** 縦軸の単位 */
        this.unitY = 50;
        /** 横軸の単位 */
        this.unitX = 50;
        /** 縦軸の単位記載 */
        this.unitXText = "横軸";
        /** 横軸の単位記載 */
        this.unitYText = "縦軸";
        /** 軸の色 */
        this.axisColor = "#000000";
        
        /** 文字色 */
        this.textColor = "#000000";
        /** 文字フォント */
        this.textFont = "18px 'ＭＳ ゴシック'";
        /** 文字アライメント */
        this.textAlign = 'left';
        
        /** 直線の幅 */
        this.lineWidth = 1;
        /** 直線の色 */
        this.lineColor = "#000000";
        /** 塗りつぶしの色 */
        this.fillColor = "#000000";
        /** 破線間隔 */
        this.lineDash = {
            no  : [0,0],
            yes : [10,10]
        };
        /** 破線フラグ */
        this.lineDashFlg = false;
        
        /** 基準の色セット */
        this.standardColorSet = [
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#FF00FF",
            "F00FFFF"            
        ];

        /** 折れ線グラフ中の丸の大きさ */
        this.circleRad = 2;
        /** 折れ線グラフの丸の色 */
        this.circleColor = this.standardColorSet;
        /** 折れ線グラフの線の太さ */
        this.circleLineWidth = 1;
        /** 折れ線グラフの線の色 */
        this.circleLineColor = this.standardColorSet;
        
        /** 棒グラフの幅 */
        this.barWidth = 10;
        /** 棒グラフの枠線の色 */
        this.barLineColor = "#000000";
        /** 棒グラフの塗りつぶしの色 */
        this.barFillColor = this.standardColorSet;

        /** 円グラフの塗りつぶしの色 */
        this.fanColor = this.standardColorSet;
        /** 円グラフデータ描画位置(半径の何割の位置か) */
        this.circleTextDrawRadRatio = 0.7;
        /** 円グラフのデータ描画最小割合 */
        this.circleMinData = 0.01;
        
        /** 凡例 */
        this.legendText = false;
    
    }
    
    // メイン関数 //////////////////////////////////////////////////////////////////
    
    /**
     * 棒グラフを描画
     * @param {arrsy[text,int...]} data グラフデータ
     * @param {arrasy[text...]} legendText  凡例データ
     * @returns {void}
     */
    DrawBarGraph(data,legendText){
        if(!this.CheckCanvas()){
            return;
        }
        // 棒グラフの幅
        let barWidth = this.barWidth;
        
        // データの処理
        data = this.dataFunction(data);

        // グラフの描画（基準線との重複を避けるため、下線は基準-1、上方へ動かす）
        for(let i=0;i<data.length;i++){
            let xPosition = this.opX + (data.xInterval * (i+1)) - (data.drawDataCount * this.barWidth)/2;
            let yPosition;

            for(let j=1;j<data[i].length;j++){
                // データを基準に合わせて処理
                let yData = (data[i][j] / this.unitY) * data.yInterval;
                if(data[i][j] > 0){
                    yPosition = data.xLineHeight - 0.5;
                }else{
                    yPosition = data.xLineHeight + 0.5;
                }

                this.DrawFillBox(xPosition + (this.barWidth * (j-1)), yPosition, barWidth, yData, this.barFillColor[j-1], this.barLineColor, false);
            }
            
            // 文字の描画
            this.DrawFillText(this.opX + (data.xInterval * (i+1)), yPosition + 21, data[i][0], 'center', 40);
        }

        this.CreateLegend(legendText,this.barFillColor);
        this.CreateTitle(this.titleText,this.titlePosition);
    }
    
    /**
     * 折れ線グラフを描画
     * @param {arrsy[text,int...]} data グラフデータ
     * @param {arrasy[text...]} legendText  凡例データ
     * @returns {void}
     */
    DrawLineGraph(data,legendText){
        if(!this.CheckCanvas() || !this.CheckData(data)){
            return;
        }

        // データの処理
        data = this.dataFunction(data);

        // 黒丸の大きさ
        let circleRad = this.circleRad;
            
        // グラフの描画
        for(let i=0;i<data.length;i++){
            let xPosition = this.opX + (data.xInterval * (i+1));
            let yPosition = data.xLineHeight;

            for(let j=1;j<data[i].length;j++){
                let yData = (data[i][j] / this.unitY) * data.yInterval;
                this.DrawFillCircle(xPosition, yPosition - yData, circleRad, this.circleColor[j-1]);
                
                if(data[i+1]){
                    this.DrawLine(xPosition, yPosition - yData, xPosition + data.xInterval, yPosition - (data[i+1][j] / this.unitY) * data.yInterval,this.lineWidth, this.circleLineColor[j-1]);
                }else{
                    this.DrawFillText(xPosition + 5, yPosition - yData + 3, legendText[j-1], 'left', 40, '#000000', "10px 'ＭＳ ゴシック'");
                }
            }

            // 文字の描画
            this.DrawFillText(xPosition, yPosition + 21, data[i][0], 'center', 40);
            
        }

        // 凡例の描画
        this.CreateLegend(legendText,this.barFillColor);
        this.CreateTitle(this.titleText,this.titlePosition);
    }

    /**
     * 円グラフを描画
     * @param {arrsy[text,int...]} data グラフデータ
     * @param {arrasy[text...]} legendText  凡例データ
     * @returns {void}
     */
    DrawCircleGraph(data,legendText){
        if(!this.CheckCanvas() || !this.CheckData(data)){
            return;
        }
        
        // 円グラフの中心点
        const op  = {x : this.width/2, y : this.height/2};
        // 円グラフの半径（描画範囲の短い側の35%の長さ）
        const rad = (this.width < this.height ? this.width : this.height) * 0.35;
        
        // 円グラフのそれぞれのパーセントの計算
        let dataSum = 0;
        for(let i=0;i<data.length;i++){
            dataSum = dataSum + data[i][1];
        }
        // 円グラフ描画
        let startAng = 0;
        for(let i=0;i<data.length;i++){
            this.DrawFillFan(op['x'],op['y'],rad,startAng, startAng + Math.PI*2*(data[i][1]/dataSum),this.fanColor[i]);
            
            // データのグラフ内へのデータ表示(一定の角度以下の場合表示しない)
            let textX = op['x'];
            let textY = op['y'];
            const textDrawRad = rad * this.circleTextDrawRadRatio;
            let textDrawAng = startAng + Math.PI*(data[i][1]/dataSum);
            if(data[i][1]/dataSum > this.circleMinData){
                // 描画位置の計算
                textX = op['x'] + Math.sin(textDrawAng) * textDrawRad;
                textY = op['y'] - Math.cos(textDrawAng) * textDrawRad;
                this.DrawFillBox(textX-18,textY,36,18,'#FFFFFF');
                this.DrawFillText(textX,textY + 16,data[i][1], 'center',50);
            }
            
            // 次データのスタート位置調整
            startAng = startAng + Math.PI*2*(data[i][1]/dataSum);
        }
        
        // 凡例の描画
        this.CreateLegend(legendText,this.barFillColor);
        this.CreateTitle(this.titleText,this.titlePosition);
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
    DrawLine(x1,y1,x2,y2,lineWidth,lineColor,lineDashFlg){
        lineWidth   = typeof lineWidth   !== 'undefined' ? lineWidth   : this.lineWidth;
        lineColor   = typeof lineColor   !== 'undefined' ? lineColor   : this.lineColor;
        lineDashFlg = typeof lineDashFlg !== 'undefined' ? lineDashFlg : this.lineDashFlg;
        
        
        this.ctx.lineWidth   = lineWidth;
        this.ctx.strokeStyle = lineColor;
        if(lineDashFlg !== true){
            this.ctx.setLineDash(this.lineDash['no']);
        }else{
            this.ctx.setLineDash(this.lineDash['yes']);
        }
        this.ctx.beginPath();
        this.ctx.moveTo(x1,y1);
        this.ctx.lineTo(x2,y2);
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
    DrawFillCircle(x,y,rad,fillColor,flg){
        fillColor = typeof fillColor !== 'undefined' ? fillColor : this.fillColor;
        flg = typeof flg !== 'undefined' ? flg : true;
        if(! flg){
            y = this.height - y;
        }
        this.ctx.beginPath();
        this.ctx.arc(x,y,rad,0,Math.PI*2,true);
        this.ctx.fillStyle   = fillColor;
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
    DrawFillFan(x,y,rad,startAng,endAng,fillColor){
        fillColor = typeof fillColor !== 'undefined' ? fillColor : this.fillColor;
        
        startAng = startAng - Math.PI/2;
        endAng   = endAng   - Math.PI/2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x,y);
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
    DrawFillBox(x,y,width,height,fillColor,lineColor,flg){
        fillColor = typeof fillColor !== 'undefined' ? fillColor : this.fillColor;
        lineColor = typeof lineColor !== 'undefined' ? lineColor : this.lineColor;
        flg = typeof flg !== 'undefined' ? flg : true;
        if(! flg){
            height = height * (-1);
        }
        this.ctx.strokeStyle = lineColor;
        this.ctx.fillStyle = fillColor;
        this.ctx.beginPath();
        this.ctx.fillRect(x,y,width,height);
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
    DrawBox(x,y,width,height,lineColor,flg){
        lineColor = typeof lineColor !== 'undefined' ? lineColor : this.lineColor;
        flg = typeof flg !== 'undefined' ? flg : true;
        if(! flg){
            height = height * (-1);
        }
        this.ctx.strokeStyle = lineColor;
        this.ctx.beginPath();
        this.ctx.strokeRect(x,y,width,height);
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
    DrawFillText(x,y,text,textAlign,maxLength,textColor,textFont){
        textColor = typeof textColor !== 'undefined' ? textColor : this.textColor;
        textFont = typeof textFont !== 'undefined' ? textFont : this.textFont;
        textAlign = typeof textAlign !== 'undefined' ? textAlign : this.textAlign;
        
        this.ctx.fillStyle = textColor;
        this.ctx.font      = textFont;
        this.ctx.textAlign = textAlign;
        this.ctx.fillText(text,x,y,maxLength);

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
    CreateAxis(axisColor,opX,opY,maxX,maxY,unitX,unitY,yCount,unitXText,unitYText){
        // 描画色の設定
        axisColor = typeof axisColor !== 'undefined' ? axisColor : this.axisColor;
        
        opX = typeof opX !== 'undefined' ? opX : this.opX;
        opY = typeof opY !== 'undefined' ? opY : this.opY;
        maxX = typeof maxX !== 'undefined' ? maxX : this.maxX;
        maxY = typeof maxY !== 'undefined' ? maxY : this.maxY;
        
        unitX = typeof unitX !== 'undefined' ? unitX : this.unitX;
        unitY = typeof unitY !== 'undefined' ? unitY : this.unitY;
        unitXText = typeof unitXText !== 'undefined' ? unitXText : this.unitXText;
        unitYText = typeof unitYText !== 'undefined' ? unitYText : this.unitYText;
        
        // 縦軸描画
        this.DrawLine(opX,opY,opX,maxY,1,axisColor);
        let tmpY = opY;
        if(yCount[1] > 0){
            // 縦軸単位線描画
            tmpY = opY - unitY;
            // 縦軸単位線（マイナス方向）
            for(let i=yCount[1]-1;i > 0;i--){
                // 基準点描画
                this.DrawLine(opX-3, Math.round(tmpY), opX+3, Math.round(tmpY), 1, axisColor);
                // 基準単位描画
                this.DrawFillText(opX-4, Math.round(tmpY) + 6, (-1) * this.unitY * i, 'right')
                // 基準線描画
                this.DrawLine(opX+4, Math.round(tmpY), this.maxX, Math.round(tmpY), 0.5, '#000000', true);
                tmpY = tmpY - unitY;
            }
        }
        
        // 横軸描画
        this.DrawLine(opX,tmpY,maxX,tmpY,1,axisColor);
        // 横軸単位線描画
        var tmpX = opX + unitX; 
        while(tmpX < maxX){
            // 基準点描画
            this.DrawLine(tmpX,tmpY-3,tmpX,tmpY+3,1,axisColor);
            tmpX = tmpX + unitX;
        }
        // 横軸単位表記描画
        this.DrawFillText(maxX,this.height-50,unitYText, 'left');
        
        // 基準単位描画(X軸)
        this.DrawFillText(opX-4, Math.round(tmpY) + 6, '0', 'right')
        
        // 描画位置を1ユニット進める
        tmpY = tmpY - unitY;
        
        // 縦軸単位線（プラス方向）
        for(let i=1;i <= yCount[0]-1;i++){
            // 基準点描画
            this.DrawLine(opX-3, Math.round(tmpY), opX+3, Math.round(tmpY), 1, axisColor);
            // 基準単位描画
            this.DrawFillText(opX-4, Math.round(tmpY) + 6, this.unitY * i, 'right')
            // 基準線描画
            this.DrawLine(opX+4, Math.round(tmpY), this.maxX, Math.round(tmpY), 0.5, '#000000', true);
            tmpY = tmpY - unitY;
        }
        // 縦軸単位表記描画
        this.DrawFillText(30,30,unitXText, 'left');
        
    }

    /**
     * 凡例の作成
     * @param {array[string...]} legendText 凡例データ
     * @param {array[string...]} fillColor    凡例用色データ
     * @returns {void}
     */
    CreateLegend(legendText,fillColor){
        legendText = legendText !== 'undefined' ? legendText : this.legendText;
        if(!legendText){
            return;
        }
        const legendCount = legendText.length;
        let tmpX = this.width - (legendCount * 60) - 10;
        let tmpY = this.height - 40;
        this.DrawBox(tmpX,tmpY,(legendCount * 60),30,'#000000',true);
        
        for(let i=0; i<legendCount; i++){
            this.DrawFillBox(tmpX + i*60 + 10,tmpY + 9,12,12,fillColor[i],fillColor[i],true)
            this.DrawFillText(tmpX + i*60 + 24,tmpY + 18,legendText[i], 'left',50,'#000000',"10px 'ＭＳ ゴシック'");
        }
    }

    /**
     * タイトルの作成
     * @param {String} title    タイトルテキスト
     * @param {int} titlePosition   表示位置フラグ
     * @return {void}
     */
    CreateTitle(title,titlePosition){
        title    = title    !== 'undefined' ? title    : this.titleText;
        titlePosition = titlePosition !== 'undefined' ? titlePosition : this.titlePosition;
        
        this.DrawFillText(this.width/2,titlePosition === 0 ? 20 : this.height -20,title, 'center');
    }

    /**
     * canvas要素の取得チェック
     * @returns {Boolean}
     */
    CheckCanvas(){
        if(this.canvas === null || !this.canvas.getContext){
            return false;
        }else{
            return true;
        }
    }
    
    /**
     * グラフデータのチェック
     * @param {array} data  グラフデータ
     * @param {int} type    グラフ種別
     * @returns {Boolean}
     */
    CheckData(data = '',type){
        if(data === null || data === ''){
            return false;
        }
        switch(type){
            case 1 : // 棒グラフ
                break;
            case 2 : // 折れ線グラフ
                break;
            case 3 : // 円グラフ
                break;
        }
        return true;
    }
    
    /**
     * 描画設定の解除
     */
    resetDrawConf(){
        this.ctx.fillStyle = this.textColor;
        this.ctx.font      = this.textFont;
        this.ctx.textAlign = this.textAlign;
        this.ctx.lineWidth   = this.lineWidth;
        this.ctx.strokeStyle = this.lineColor;
        // 破線フラグ解除
        this.ctx.setLineDash(this.lineDash['no']);
        // 描画色デフォルト
        this.ctx.strokeStyle = this.lineColor;
        
    }
    
    /**
     * 棒グラフ、折れ線グラフ用 データ処理部共通化
     * @param {array} 描画データ
     * @return {array} 描画データ＋[drawDataCount:描画データ数,xInterval:x軸の間隔,yInterval:Y軸の間隔,xLineHeightx軸の描画高さ]
     */
    dataFunction(data){
        // グラフ間隔の計算(X軸)
        const xCount = data.length;
        const xInterval = (this.maxX - this.opX) / (xCount + 1);
        
        // 1グループのデータ数の取得
        const drawDataCount = data[0].length - 1;
        
        // Y軸最大値計算用
        let maxYdata = 0;
        for(let i=0;i<data.length;i++){
            for(let j=1;j<drawDataCount+1;j++){
                // Y軸最大値の再計算
                if(maxYdata < data[i][j]){
                    maxYdata = data[i][j];
                }
            }
        }
        // Y軸最小値計算用
        let minYdata = 0;
        let YminusFlg = false;
        for(let i=0;i<data.length;i++){
            for(let j=1;j<drawDataCount+1;j++){
                // Y軸最小値の再計算
                if(minYdata > data[i][j]){
                    minYdata = data[i][j];
                }
            }
        }
        // Y軸の計算[ プラス方向 , マイナス報告 ]
        const yCount = [ Math.ceil(maxYdata / this.unitY) , Math.ceil((-1) * minYdata / this.unitY) ];
        const yInterval = Math.abs(this.maxY - this.opY) / (yCount[0] + yCount[1]);
        // 横軸描画高さを計算
        const xLineHeight = this.opY - yCount[1] * yInterval;

        // 軸の生成
        this.CreateAxis(this.axisColor,this.opX,this.opY,this.maxX,this.maxY,xInterval,yInterval,yCount,this.unitXText,this.unitYText);
        
        
        // データセット、値返却
        data.drawDataCount = drawDataCount;
        
        data.xInterval = xInterval;
        data.yInterval = yInterval;
        
        data.xLineHeight = xLineHeight;
        
        return data;
    }
}
