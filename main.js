class Main{
    constructor(element){
        this.Element=element;
        this.stateInit();
        //プレイ済みデータの有無 あったらそれを配置 なければランダム配置
        if(typeof(localStorage.getItem('data'))=="string"){
            this.loadData();
        }else{
            this.makeBlock();
        }
        this.saveData();
    }
    stateInit(){
        this.updateScore(0);
        this.BlocksNumber=new Array(3);
        this.isCombinedBlocks=new Array(3);
        this.PreviousPlacement=new Array(3);
        for(let y = 0; y < 4; y++) {
            this.BlocksNumber[y] = new Array(4).fill(0);
            this.isCombinedBlocks[y] = new Array(4).fill(0);
            this.PreviousPlacement[y] = new Array(4).fill(0);
        }
    }
    loadData(){
        let ary = localStorage.getItem('data').split(',');
        let k=0;
        let maxnum =2;
        for(let i =0;i<4;i++){
            for(let j =0;j<4;j++,k++){
                this.BlocksNumber[i][j]=this.PreviousPlacement[i][j]=Number(ary[k]);
                if(this.BlocksNumber[i][j]>maxnum) maxnum=this.BlocksNumber[i][j];
                if(this.BlocksNumber[i][j]!=0) this.makeBlock(i,j,this.BlocksNumber[i][j]);
            }
        }
        this.updateScore(Number(ary[ary.length-1]));
    }
    updateScore(s){
        this.Score = s;
        document.getElementById("score").innerHTML="<p>"+this.Score+"</p>";
    }
    makeBlock(...args){
        let i,j,inputnum;
        switch(args.length){
            case 0:
            while(true){
                i = Math.floor(Math.random()*10)%4;
                j = Math.floor(Math.random()*10)%4;
                if(this.BlocksNumber[i][j]==0){
                    break;
                }
            }
            const rand = Math.floor(Math.random() * 100);
            if(rand<=10) inputnum = 4
            else inputnum = 2;
                break;
            case 3:
                i =args[0];
                j =args[1];
                inputnum = args[2];
                break;
            default:
                throw "inappropriate argument number";
        }
        this.BlocksNumber[i][j] = inputnum;
        this.PreviousPlacement[i][j] = inputnum;
        new Promise((resolve)=>{
            if(inputnum>128){
                this.Element.insertAdjacentHTML('afterend', 
                    '<div class = "makingblock_128" id="x'+i+'y'+j+'_m"><p>'+inputnum+'</p></div>'
                );
            }else{
                this.Element.insertAdjacentHTML('afterend', 
                    '<div class = "makingblock_'+inputnum+'" id="x'+i+'y'+j+'_m"><p>'+inputnum+'</p></div>'
                );
            }
            resolve();
        }).then(()=>{
            setTimeout(()=>{
                document.getElementById("x"+i+"y"+j+"_m").id="x"+i+"y"+j;
                if(inputnum>128){
                    document.getElementById("x"+i+"y"+j).className="block_128";
                }else{
                    document.getElementById("x"+i+"y"+j).className="block_"+inputnum;
                }
            },10)
        });
    }
    spinArrayCW(arr,deg){
        let array=new Array(3);
        for(let y = 0; y < 4; y++) {
            array[y] = new Array(4).fill(0);
        }
        if(deg%90==0&&deg>=0){
            let m=0;
            let n=0;
            for(let i =0;i<4;i++){
                for(let j=3;j>=0;j--){
                    array[m][n]=arr[i][j];
                    m++;
                    if(m==4){
                        m=0;
                        n++;
                    }
                }
            }
            if(deg>90) array=this.spinArrayCW(array,deg-90);
        }else{
            throw "inappropriate argument number";
        }
        return array;
    }
    spinArrayIndexCW(x,y,deg){
        let indexarr=[[[3,0],[2,0],[1,0],[0,0]]
                    ,[[3,1],[2,1],[1,1],[0,1]]
                    ,[[3,2],[2,2],[1,2],[0,2]]
                    ,[[3,3],[2,3],[1,3],[0,3]]];
        let index
        if(deg%90==0&&deg>=0){
            index=indexarr[x][y];
            if(deg>90) index=this.spinArrayIndexCW(index[0],index[1],deg-90);
        }else{
            throw "inappropriate argument number";
        }
        return index;
    }
    moveBlock(direction){
        localStorage.removeItem("data");
        let degree=360;
        switch(direction){
            case "UP":
                degree=degree-0;
                break;
            case "R":
                this.BlocksNumber=this.spinArrayCW(this.BlocksNumber,270);
                this.isCombinedBlocks=this.spinArrayCW(this.isCombinedBlocks,270);
                degree=degree-270;
                break;
            case "L":
                this.BlocksNumber=this.spinArrayCW(this.BlocksNumber,90);
                this.isCombinedBlocks=this.spinArrayCW(this.isCombinedBlocks,90);
                degree=degree-90;
                break;
            case "DOWN":
                this.BlocksNumber=this.spinArrayCW(this.BlocksNumber,180);
                this.isCombinedBlocks=this.spinArrayCW(this.isCombinedBlocks,180);
                degree=degree-180;
                break;
            default:
                throw "inappropriate argument number";
        }
        for(let x =0;x<4;x++){
            for(let y = 0;y<4;y++){
                if(this.BlocksNumber[x][y]!=0){
                    let i;
                    for(i = y-1;i>-1;i--){
                        if(this.BlocksNumber[x][i]!=0)break;
                    };
                    if(i!=-1&&this.BlocksNumber[x][y]==this.BlocksNumber[x][i]&&this.isCombinedBlocks[x][i]!=1){/*加算移動,移動先:i*/
                        this.BlocksNumber[x][i]+=this.BlocksNumber[x][y];
                        this.BlocksNumber[x][y]=0;
                        this.isCombinedBlocks[x][i]=1;
                        this.updateScore(this.Score+this.BlocksNumber[x][i]);
                        let indexbefor=this.spinArrayIndexCW(x,y,degree);
                        let indexafter=this.spinArrayIndexCW(x,i,degree);
                        this.combiningBlockMotion(indexbefor[0],indexbefor[1],indexafter[0],indexafter[1]);
                    }else{/*通常移動,移動先:(i+1)*/ 
                        if(y!=(i+1)){
                            this.BlocksNumber[x][i+1]=this.BlocksNumber[x][y];
                            this.BlocksNumber[x][y]=0;
                            let indexbefor=this.spinArrayIndexCW(x,y,degree);
                            let indexafter=this.spinArrayIndexCW(x,i+1,degree);
                            this.moveingBlockMotion(indexbefor[0],indexbefor[1],indexafter[0],indexafter[1]);
                        }
                    }
                }
            }
        }
        this.BlocksNumber=this.spinArrayCW(this.BlocksNumber,degree);
        this.isCombinedBlocks=this.spinArrayCW(this.isCombinedBlocks,degree);
        setInterval(()=>{
            for(let j =0;j<4;j++){
                for(let i=0;i<4;i++){
                    if(this.isCombinedBlocks[i][j]!=0){
                        this.combinedBlockMotion(i,j);
                    };
                    this.isCombinedBlocks[i][j]=0;
                }
            }
        })
        let wasMoved =true;
        for(let i =0;i<4;i++){
            for(let j=0;j<4;j++){
                if(this.BlocksNumber[i][j]!=this.PreviousPlacement[i][j]){
                    wasMoved = false;
                }
                this.PreviousPlacement[i][j]=this.BlocksNumber[i][j];
            }
        }
        if(wasMoved){
            this.gameEndCheck();
        }else{
            this.makeBlock();
        }
        this.saveData();
    }
    gameEndCheck(){
        let isEnd=true;
        for(let i =0;i<4;i++){
            for(let j=0;j<4;j++){
                if((i-1)>=0&&(this.BlocksNumber[i][j]==this.BlocksNumber[i-1][j]||this.BlocksNumber[i-1][j]==0)){
                    isEnd = false;
                }
                if((i+1)<4&&(this.BlocksNumber[i][j]==this.BlocksNumber[i+1][j]||this.BlocksNumber[i+1][j]==0)){
                    isEnd = false;
                }
                if((j-1)>=0&&(this.BlocksNumber[i][j]==this.BlocksNumber[i][j-1]||this.BlocksNumber[i][j-1]==0)){
                    isEnd = false;
                }
                if((j+1)>=0&&(this.BlocksNumber[i][j]==this.BlocksNumber[i][j+1]||this.BlocksNumber[i][j+1]==0)){
                    isEnd = false;
                }
            }
        }
        if(isEnd){
            this.gameOverOnOff(true);
        }
    }
    moveingBlockMotion(x,y,m,n){
        document.getElementById("x"+x+"y"+y).id="x"+m+"y"+n;
    }
    combiningBlockMotion(x,y,m,n){
        new Promise((resolve)=>{
            document.getElementById("x"+x+"y"+y).id="x"+m+"y"+n+"_";
            setTimeout(()=>{
                resolve();
            },100);
        }).then(()=>{
            document.getElementById("x"+m+"y"+n+"_").remove();
            
        });
    }
    combinedBlockMotion(x,y){
        new Promise((resolve)=>{
            if(this.BlocksNumber[x][y]>128){
                document.getElementById("x"+x+"y"+y).className="changingblock_128";
            }else{
                document.getElementById("x"+x+"y"+y).className="changingblock_"+this.BlocksNumber[x][y];
            }
            document.getElementById("x"+x+"y"+y).id="x"+x+"y"+y+"_e";
            document.getElementById("x"+x+"y"+y+"_e").innerHTML="<p>"+this.BlocksNumber[x][y]+"</p>";
            setTimeout(()=>{
                resolve();
            },150);
        }).then(()=>{
            setTimeout(()=>{
                document.getElementById("x"+x+"y"+y+"_e").id="x"+x+"y"+y;
                if(this.BlocksNumber[x][y]>128){
                    document.getElementById("x"+x+"y"+y).className="block_128";
                }else{
                    document.getElementById("x"+x+"y"+y).className="block_"+this.BlocksNumber[x][y];
                }
            },10);
        });
    }
    gameOverOnOff(bool){
        if(bool){
            if(document.getElementById("gamemessage_off")!=null&&document.getElementById("retrybutton_off")!=null){
                document.getElementById("gamemessage_off").id="gamemessage_on";
                document.getElementById("retrybutton_off").id="retrybutton_on";
            }
        }else{
            if(document.getElementById("gamemessage_on")!=null){
                document.getElementById("gamemessage_on").id="gamemessage_off";
                document.getElementById("retrybutton_on").id="retrybutton_off";
            }
        }
    }
    saveData(){
        localStorage.removeItem("data");
        let stragestr = "";
        for(let i =0;i<4;i++){
            for(let j =0;j<4;j++){
                stragestr=stragestr.concat(""+this.BlocksNumber[i][j]+",");
            }
        }
        stragestr=stragestr.concat(""+this.Score);
        localStorage.setItem("data",stragestr);
    }
    restart(){
        localStorage.removeItem('data');
        for(let i =0;i<4;i++){
            for(let j=0;j<4;j++){
                if(document.getElementById("x"+i+"y"+j)!=null){
                    document.getElementById("x"+i+"y"+j).remove();
                }
            }
        }
        this.gameOverOnOff(false);
        this.stateInit();
        this.makeBlock();
    }
}