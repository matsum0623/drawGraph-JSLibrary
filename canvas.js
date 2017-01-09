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
        
        /** 軸描画用基準点設定（左下を基準点とする）*/
        this.opX  = 50;                 // 基準点X
        this.opY  = this.height - 50;   // 基準点Y
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
        this.axisColor = "rgb(00,00,00)";
        
        /** 文字色 */
        this.textColor = "rgb(00,00,00)";
        /** 文字フォント */
        this.textFont = "18px 'ＭＳ Ｐゴシック'";
        
        /** 直線の幅 */
        this.lineWidth = 1;
        /** 直線の色 */
        this.lineColor = "rgb(00,00,00)";
        /** 塗りつぶしの色 */
        this.fillColor = "rgb(00,00,00)";
        
        /** 折れ線グラフ中の丸の大きさ */
        this.circleRad = 2;
        /** 折れ線グラフの丸の色 */
        this.circleColor = [
            "rgb(255,00,00)",
            "rgb(00,255,00)",
            "rgb(00,00,255)",
            "rgb(255,255,00)",
            "rgb(255,00,255)",
            "rgb(00,255,255)"            
        ];
        /** 折れ線グラフの線の太さ */
        this.circleLineWidth = 1;
        /** 折れ線グラフの線の色 */
        this.circleLineColor = [
            "rgb(255,00,00)",
            "rgb(00,255,00)",
            "rgb(00,00,255)",
            "rgb(255,255,00)",
            "rgb(255,00,255)",
            "rgb(00,255,255)"            
        ];
        
        /** 棒グラフの幅 */
        this.barWidth = 10;
        /** 棒グラフの枠線の色 */
        this.barLineColor = "rgb(00,00,00)";
        /** 棒グラフの塗りつぶしの色 */
        this.barFillColor = [
            "rgb(255,00,00)",
            "rgb(00,255,00)",
            "rgb(00,00,255)",
            "rgb(255,255,00)",
            "rgb(255,00,255)",
            "rgb(00,255,255)"            
        ];
    }
    /**
     * 棒グラフを描画
     * @param {type} data
     * @returns {undefined}
     */
    drawBarGraph(data){
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

    }
    /**
     * 折れ線グラフを描画
     * @@param {array} data 
     */
    drawLineGraph(data){
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
    }
    /**
     * 円グラフを描画
     */
    drawCircleGraph(){}
        
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
            this.DrawFillText(maxX,this.height-30,unitYText);
        }

        /**
         * 折れ線グラフを描画
         * @param {array()} data    描画データ
         * @returns {void}
         */
        CreateLineGraph(data){
            // 軸の生成
            this.CreateAxis();

            // 基準点X
            let opX = this.opX + 10;
            // 基準点Y
            let opY = this.opY;
            // 黒丸の大きさ
            let circleRad = this.circleRad;
            
            // グラフの描画
            for(let i=0;i<data.length;i++){
                this.DrawFillCircle(opX + data[i][0],opY - data[i][1],circleRad);
                if(data[i+1]){
                    this.DrawLine(opX + data[i][0],opY-data[i][1],opX + data[i+1][0],opY-data[i+1][1]);
                }
            }
        }
        
        /**
         * canvas要素の取得チェック
         * @returns {Boolean}
         */
        checkCanvas(){
            if(this.canvas === null){
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
