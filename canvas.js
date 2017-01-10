/**
 * Canvasによるグラフ描画ライブラリ
 * ES2015の機能を使用しているため、IEでは動作しない=>IE時の考慮は未実装
 * 現在は２Dのみの対応
 */
class drawGraph{
    /**
     * 
     * @param {type} canvas
     * @param {type} width
     * @param {type} height
     * @returns {drawGraph}
     */
    constructor(canvas,width,height){
        this.width = typeof width !== 'undefined' ? width : 800;
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
        this.opX  = 50;                 // 基準点X
        this.opY  = this.height - 70;   // 基準点Y
        this.maxX = this.width  - 50;   // 最大X
        this.maxY = 50;                 // 最大Y
        
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
        this.textFont = "18px 'ＭＳ Ｐゴシック'";
        
        /** 直線の幅 */
        this.lineWidth = 1;
        /** 直線の色 */
        this.lineColor = "#000000";
        /** 塗りつぶしの色 */
        this.fillColor = "#000000";
        
        /** 折れ線グラフ中の丸の大きさ */
        this.circleRad = 2;
        /** 折れ線グラフの丸の色 */
        this.circleColor = [
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#FF00FF",
            "F00FFFF"            
        ];
        /** 折れ線グラフの線の太さ */
        this.circleLineWidth = 1;
        /** 折れ線グラフの線の色 */
        this.circleLineColor = [
            "#F00000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#FF00FF",
            "F00FFFF"            
        ];
        
        /** 棒グラフの幅 */
        this.barWidth = 10;
        /** 棒グラフの枠線の色 */
        this.barLineColor = "#000000";
        /** 棒グラフの塗りつぶしの色 */
        this.barFillColor = [
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#FF00FF",
            "#00FFFF"            
        ];

        /** 円グラフの塗りつぶしの色 */
        this.fanColor = [
            "#FF0000",
            "#00FF00",
            "#0000FF",
            "#FFFF00",
            "#FF00FF",
            "F00FFFF"            
        ];
        
        /** 凡例 */
        this.legendText = false;
    
    }
    /**
     * 棒グラフを描画
     * @param {type} data
     * @returns {undefined}
     */
    drawBarGraph(data,legendText){
        if(!this.checkCanvas()){
            return;
        }
        // 棒グラフの幅
        let barWidth = this.barWidth;
        // 基準点X
        let opX = this.opX;
        // 基準点Y
        let opY = this.opY;
        
        // グラフ間隔の計算(X軸)
        const xCount = data.length;
        const xInterval = (this.maxX - opX) / (xCount + 1);
        
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
        // Y軸の計算
        const yCount = Math.floor(maxYdata / this.unitY);
        const yInterval = Math.abs(this.maxY - opY) / (yCount + 1);
        
        // 軸の生成
        this.CreateAxis(this.axisColor,opX,opY,this.maxX,this.maxY,xInterval,yInterval,this.unitXText,this.unitYText);

        // グラフの描画（基準線との重複を避けるため、下線は基準-1、上方へ動かす）
        for(let i=0;i<data.length;i++){
            let xPosition = opX + (xInterval * (i+1)) - (drawDataCount * this.barWidth)/2;
            let yPosition = opY - 1;

            for(let j=1;j<data[i].length;j++){
                // データを基準に合わせて処理
                let yData = (data[i][j] / this.unitY) * yInterval;

                this.DrawFillBox(xPosition + (this.barWidth * (j-1)), yPosition, barWidth, yData, this.barFillColor[j-1], this.barLineColor, false);
            }
            
            // 文字の描画
            this.DrawFillText(xPosition, yPosition + 15, data[i][0], 40);
        }

        this.CreateLegend(legendText,this.barFillColor);
        this.CreateTitle(this.titleText,this.titlePosition);
    }
    /**
     * 折れ線グラフを描画
     * @@param {array} data 
     */
    drawLineGraph(data,legendText){
        if(!this.checkCanvas() || !this.checkData(data)){
            return;
        }
        // 基準点X
        let opX = this.opX;
        // 基準点Y
        let opY = this.opY;
        
        // グラフ間隔の計算(X軸)
        const xCount = data.length;
        const xInterval = (this.maxX - opX) / (xCount + 1);
        
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
        // Y軸の計算
        const yCount = Math.floor(maxYdata / this.unitY);
        const yInterval = Math.abs(this.maxY - opY) / (yCount + 1);
        
        // 軸の生成
        this.CreateAxis(this.axisColor,opX,opY,this.maxX,this.maxY,xInterval,yInterval,this.unitXText,this.unitYText);

        // 黒丸の大きさ
        let circleRad = this.circleRad;
            
        // グラフの描画
        for(let i=0;i<data.length;i++){
            let xPosition = opX + (xInterval * (i+1));
            let yPosition = opY - 1;

            for(let j=1;j<data[i].length;j++){
                let yData = (data[i][j] / this.unitY) * yInterval;
                this.DrawFillCircle(xPosition, opY - yData, circleRad, this.circleColor[j-1]);
                
                if(data[i+1]){
                    this.DrawLine(xPosition, opY - yData, xPosition + xInterval, opY - (data[i+1][j] / this.unitY) * yInterval,this.lineWidth, this.circleLineColor[j-1]);
                }
            }

            // 文字の描画
            this.DrawFillText(xPosition, yPosition + 15, data[i][0], 40);
        }

        // 凡例の描画
        this.CreateLegend(legendText,this.barFillColor);
        this.CreateTitle(this.titleText,this.titlePosition);
    }
    /**
     * 円グラフを描画
     * @param {array} data 
     */
    drawCircleGraph(data,legendText){
        if(!this.checkCanvas() || !this.checkData(data)){
            return;
        }
        
        // 円グラフの中心点
        const op  = [this.width/2,this.height/2];
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
            this.DrawFillFan(op[0],op[1],rad,startAng, startAng + Math.PI*2*(data[i][1]/dataSum),this.fanColor[i]);
            startAng = startAng + Math.PI*2*(data[i][1]/dataSum);
        }
        
        // 凡例の描画
        this.CreateLegend(legendText,this.barFillColor);
        this.CreateTitle(this.titleText,this.titlePosition);
    }
        
    // 内部関数 ///////////////////////////////////////////////////////////////
        /**
         * 直線を追加
         * @param {type} x1
         * @param {type} y1
         * @param {type} x2
         * @param {type} y2
         * @param {type} width
         * @param {type} color
         * @returns {undefined}
         */
        DrawLine(x1,y1,x2,y2,width,color){
            width = typeof width !== 'undefined' ? width : this.lineWidth;
            color = typeof color !== 'undefined' ? color : this.lineColor;
            this.ctx.lineWidth = width;
            this.ctx.strokeStyle = color;
            this.ctx.beginPath();
            this.ctx.moveTo(x1,y1);
            this.ctx.lineTo(x2,y2);
            this.ctx.closePath();
            this.ctx.stroke();
        }

        /**
         * 塗りつぶした正円を追加
         * @param {int} x         X座標
         * @param {int} y         Y座標
         * @param {int} rad       半径
         * @param {String} fillColor  塗りつぶしの色
         * @param {boolean} flg   基準フラグ（true：左上、false：左下）
         * @returns void        
         */
        DrawFillCircle(x,y,rad,fillColor,flg){
            fillColor = typeof fillColor !== 'undefined' ? fillColor : this.fillColor;
            flg = typeof flg !== 'undefined' ? flg : true;
            if(! flg){
                y = this.height - y;
            }
            this.ctx.beginPath();
            this.ctx.arc(x,y,rad,0,2*Math.PI,true);
            this.ctx.fillStyle   = fillColor;
            this.ctx.strokeStyle = fillColor;
            this.ctx.stroke();
            this.ctx.fill();
        }
        
        /**
         * 塗りつぶした扇形を作成
         * 基準点は真上に修正される
         * @param {type} x
         * @param {type} y
         * @param {type} rad
         * @param {type} startAng
         * @param {type} endAng
         * @param {type} fillColor
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
        }
        
        /**
         * 塗りつぶした四角形を描画する
         * @param {type} x      始点のX座標    
         * @param {type} y      始点のY座標
         * @param {type} width  四角形の幅
         * @param {type} height 四角形の高さ
         * @param {type} fillColor description
         * @param {type} lineColor description
         * @param {type} flg    基準フラグ（true：左上、false：左下）
         * @returns {undefined}
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
        }
        
        /**
         * 四角形を描画
         * @param {type} x
         * @param {type} y
         * @param {type} width
         * @param {type} height
         * @param {type} lineColor
         * @param {type} flg
         * @returns {undefined}
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
        }
        
        /**
         * 
         * @param {type} x
         * @param {type} y
         * @param {type} text
         * @param {type} maxLength 
         * @param {type} textColor
         * @param {type} font 
         * @returns {undefined}
         */
        DrawFillText(x,y,text,maxLength,textColor,font){
            textColor = typeof textColor !== 'undefined' ? textColor : this.textColor;
            font = typeof font !== 'undefined' ? font : this.font;
            
            this.ctx.fillStyle = textColor;
            this.ctx.font      = font;
            this.ctx.fillText(text,x,y,maxLength);
        }
        
        /**
         * 縦軸/横軸を描画
         * @param {text} axisColor 軸の色
         * @param {int} opX 基準点のX位置
         * @param {int} opY 基準点のY位置
         * @param {int} maxX X軸の最大位置
         * @param {int} maxY Y軸の最大位置
         * @param {int} unitX X軸の単位間隔
         * @param {int} unitY Y軸の単位間隔
         * @param {text} unitXText X軸の単位表記
         * @param {text} unitYText Y軸の単位表記
         * @returns void
         */
        CreateAxis(axisColor,opX,opY,maxX,maxY,unitX,unitY,unitXText,unitYText){
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
            // 縦軸単位線描画
            var tmpY = opY - unitY; 
            while(tmpY > maxY){
                this.DrawLine(opX-3,tmpY,opX+3,tmpY,1,axisColor);
                tmpY = tmpY - unitY;
            }
            // 縦軸単位表記描画
            this.DrawFillText(30,30,unitXText);
            
            // 横軸描画
            this.DrawLine(opX,opY,maxX,opY,1,axisColor);
            // 横軸単位線描画
            var tmpX = opX + unitX; 
            while(tmpX < maxX){
                this.DrawLine(tmpX,opY-3,tmpX,opY+3,1,axisColor);
                tmpX = tmpX + unitX;
            }
            // 縦軸単位表記描画
            this.DrawFillText(maxX,this.height-50,unitYText);
        }

        /**
         * 凡例の作成
         * @param {array(string)} legendText
         * @param {string} fillColor 
         * @returns {undefined}
         */
        CreateLegend(legendText,fillColor){
            legendText = legendText !== 'undefined' ? legendText : this.legendText;
            if(!legendText){
                return;
            }
            const legendCount = legendText.length;
            let tmpX = this.width - (legendCount * 60) - 10;
            let tmpY = this.height - 40;
            this.DrawBox(tmpX,tmpY,(legendCount * 60),30,"rgb(00,00,00)",true);
            
            for(let i=0; i<legendCount; i++){
                this.DrawFillBox(tmpX + i*60 + 10,tmpY + 9,12,12,fillColor[i],fillColor[i],true)
                this.DrawFillText(tmpX + i*60 + 24,tmpY + 18,legendText[i],50);
            }
        }

        /**
         * タイトルの作成
         * @param {string} title
         * @param {int} position
         * @return {undifined}
         */
        CreateTitle(title,position){
            title    = title    !== 'undefined' ? title    : this.titleText;
            position = position !== 'undefined' ? position : this.titlePosition;
            
            this.ctx.textAlign = "center";
            this.DrawFillText(this.width/2,position === 0 ? 20 : this.height -20,title);
        }
        /**
         * canvas要素の取得チェック
         * @returns {Boolean}
         */
        checkCanvas(){
            if(this.canvas === null || !this.canvas.getContext){
                return false;
            }else{
                return true;
            }
        }
        
        /**
         * 
         * @param {array} data  グラフデータ
         * @param {int} type    グラフ種別
         * @returns {Boolean}
         */
        checkData(data = '',type){
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
}
