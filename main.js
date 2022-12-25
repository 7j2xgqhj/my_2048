class Main{
    constructor(element){
        this.element=element;
        this.score =0;
        this.blockNumberList=[2];
        this.numbers=new Array(3);
        this.fnumbers=new Array(3);
        this.cash=new Array(3);
        for(let y = 0; y < 4; y++) {
            this.numbers[y] = new Array(4).fill(0);
            this.fnumbers[y] = new Array(4).fill(0);
            this.cash[y] = new Array(4).fill(0);
        }
        console.log(typeof(localStorage.getItem('data')));
        //プレイ済みデータの有無 あったらそれを配置 なければランダム配置
        if(typeof(localStorage.getItem('data'))=="string"){
            console.log("h"+localStorage.getItem('data'));
            let ary = localStorage.getItem('data').split(',');
            for(let n=0;n<17;n++) console.log(ary[n]);
            let k=0;
            let maxnum =2;
            for(let i =0;i<4;i++){
                for(let j =0;j<4;j++,k++){
                    this.numbers[i][j]=Number(ary[k]);
                    this.cash[i][j]=Number(ary[k]);
                    if(this.numbers[i][j]>maxnum) maxnum=this.numbers[i][j];
                    console.log("num"+k+":"+this.numbers[i][j]);
                    if(this.numbers[i][j]!=0) this.make_newblock_cash(i,j,this.numbers[i][j]);
                }
            }
            this.score = Number(ary[k]);
            document.getElementById("score").innerHTML="<p>"+this.score+"</p>";
            this.blockNumberList =[];
            for(;maxnum>=2;maxnum/=2) this.blockNumberList.unshift(maxnum);
        }else{
            this.make_newblock();
        }
        this.stragemake();
    }
    make_newblock(){
        let i,j;
        loop :
        for(i=0;i<4;i++){
            for(j=0;j<4;j++){
                if(this.numbers[i][j]==0){
                    break loop;
                }
            }
        }
        if(i>3){
            if(this.endflag==0){
                this.endflag=1;
                document.getElementById("gamemessage_off").id="gamemessage_on";
                document.getElementById("retrybutton_off").id="retrybutton_on";
            }
        }
        while(true){
            i = Math.floor(Math.random()*10)%4;
            j = Math.floor(Math.random()*10)%4;
            if(this.numbers[i][j]==0){
                break;
            }
        }
        /*inputnum計算 */
        let inputnum_arr=[];
        for(let k= 0;k<this.blockNumberList.length;k++){
            for(let l = (this.blockNumberList.length-k)**5;l>0;l--){
                inputnum_arr.push(this.blockNumberList[k]);
            }
        };
        let inputnum = inputnum_arr[Math.round(Math.random()*1000)%inputnum_arr.length];
        /*************************/
        this.numbers[i][j] = inputnum;
        this.cash[i][j] = inputnum;
        new Promise((resolve)=>{
            if(inputnum>128){
                this.element.insertAdjacentHTML('afterend', 
                    '<div class = "makingblock_128" id="x'+i+'y'+j+'_m"><p>'+inputnum+'</p></div>'
                );
            }else{
                this.element.insertAdjacentHTML('afterend', 
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
    make_newblock_cash(x,y,num){
        let i =x;
        let j =y;
        let inputnum = num;
        this.numbers[i][j] = inputnum;
        this.cash[i][j] = inputnum;
        new Promise((resolve)=>{
            if(inputnum>128){
                this.element.insertAdjacentHTML('afterend', 
                    '<div class = "makingblock_128" id="x'+i+'y'+j+'_m"><p>'+inputnum+'</p></div>'
                );
            }else{
                this.element.insertAdjacentHTML('afterend', 
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
    move_block(direction){
        localStorage.removeItem("data");
        if(direction=="UP"){
            for(let x =0;x<4;x++){
                for(let y = 0;y<4;y++){
                    if(this.numbers[x][y]!=0){
                        console.log("do:UP,as X="+x+" Y="+y);
                        let i;
                        for(i = y-1;i>-1;i--){
                            if(this.numbers[x][i]!=0)break;
                        };
                        console.log("to"+(i+1));
                        if(i!=-1&&this.numbers[x][y]==this.numbers[x][i]&&this.fnumbers[x][i]!=1){/*場合:加算移動,移動先:i*/
                            this.numbers[x][i]+=this.numbers[x][y];
                            this.numbers[x][y]=0;
                            this.fnumbers[x][i]=1;
                            if(document.getElementById("x"+x+"y"+y)==null){
                                console.log("e;x"+i+"y"+y);
                                y--;
                                continue;
                            }
                            new Promise((resolve)=>{
                                document.getElementById("x"+x+"y"+y).id="x"+x+"y"+i+"_";
                                setTimeout(()=>{
                                    resolve();
                                },100);
                            }).then(()=>{
                                console.log("remove:D");
                                document.getElementById("x"+x+"y"+i+"_").remove();
                            });
                        }else{/*場合:通常移動,移動先:(i+1)*/ 
                            if(y!=(i+1)){
                                document.getElementById("x"+x+"y"+y).id="x"+x+"y"+(i+1);
                                this.numbers[x][i+1]=this.numbers[x][y];
                                this.numbers[x][y]=0;
                            }
                        }
                    }
                }
            }
        }else if(direction=="R"){/* 以下、R時*/
            for(let y= 0;y<4;y++){
                for(let x=3;x>=0;x--){
                    if(this.numbers[x][y]!=0){
                        console.log("do:R,as X="+x+" Y="+y);
                        let i;
                        for(i = x +1;i<4;i++){
                            if(this.numbers[i][y]!=0)break;
                        };
                        console.log("to"+(i-1));
                        if(i!=4&&this.numbers[x][y]==this.numbers[i][y]&&this.fnumbers[i][y]!=1){/*場合:加算移動,移動先:i*/
                            this.numbers[i][y]+=this.numbers[x][y];
                            this.numbers[x][y]=0;
                            this.fnumbers[i][y]=1;
                            new Promise((resolve)=>{
                                document.getElementById("x"+x+"y"+y).id="x"+i+"y"+y+"_";
                                setTimeout(()=>{
                                    resolve();
                                },100);
                            }).then(()=>{
                                console.log("remove:D");
                                document.getElementById("x"+i+"y"+y+"_").remove();
                            });
                        }else{/*場合:通常移動,移動先:(i-1)*/
                            if(x!=(i-1)){
                                document.getElementById("x"+x+"y"+y).id="x"+(i-1)+"y"+y;
                                this.numbers[i-1][y]=this.numbers[x][y];
                                this.numbers[x][y]=0;
                            }
                        }
                    }
                }
            }
        }else if(direction=="L"){
            for(let y= 0;y<4;y++){
                for(let x=0;x<4;x++){
                    if(this.numbers[x][y]!=0){
                        console.log("do:L,as X="+x+" Y="+y);
                        let i;
                        for(i = x-1;i>=0;i--){
                            if(this.numbers[i][y]!=0)break;
                        };
                        console.log("to"+(i+1));
                        if(i!=-1&&this.numbers[x][y]==this.numbers[i][y]&&this.fnumbers[i][y]!=1){/*場合:加算移動,移動先:i*/
                            this.numbers[i][y]+=this.numbers[x][y];
                            this.numbers[x][y]=0;
                            this.fnumbers[i][y]=1;
                            new Promise((resolve)=>{
                                document.getElementById("x"+x+"y"+y).id="x"+i+"y"+y+"_";
                                setTimeout(()=>{
                                    resolve();
                                },100);
                            }).then(()=>{
                                console.log("remove:D");
                                document.getElementById("x"+i+"y"+y+"_").remove();
                            });
                        }else{/*場合:通常移動,移動先:(i+1)*/
                            if(x!=(i+1)){
                                document.getElementById("x"+x+"y"+y).id="x"+(i+1)+"y"+y;
                                this.numbers[i+1][y]=this.numbers[x][y];
                                this.numbers[x][y]=0;
                            }
                        }
                    }
                }
            }
        }else if(direction=="DOWN"){
            for(let x =0;x<4;x++){
                for(let y = 3;y>=0;y--){
                    if(this.numbers[x][y]!=0){
                        console.log("do:DOWN,as X="+x+" Y="+y);
                        let i;
                        for(i = y+1;i<4;i++){
                            if(this.numbers[x][i]!=0)break;
                        };
                        console.log("to"+(i-1));
                        if(i!=4&&this.numbers[x][y]==this.numbers[x][i]&&this.fnumbers[x][i]!=1){/*場合:加算移動,移動先:i*/
                            this.numbers[x][i]+=this.numbers[x][y];
                            this.numbers[x][y]=0;
                            this.fnumbers[x][i]=1;
                            new Promise((resolve)=>{
                                document.getElementById("x"+x+"y"+y).id="x"+x+"y"+i+"_";
                                setTimeout(()=>{
                                    resolve();
                                },100);
                            }).then(()=>{
                                console.log("remove:D");
                                document.getElementById("x"+x+"y"+i+"_").remove();
                            });
                        }else{/*場合:通常移動,移動先:(i-1)*/ 
                            if(y!=(i-1)){
                                document.getElementById("x"+x+"y"+y).id="x"+x+"y"+(i-1);
                                this.numbers[x][i-1]=this.numbers[x][y];
                                this.numbers[x][y]=0;
                            }
                        }
                    }
                }
            }
        }else{
            console.log("error");
        }
        setInterval(()=>{
            for(let j =0;j<4;j++){
                for(let i=0;i<4;i++){
                    if(this.fnumbers[i][j]!=0){
                        console.log(this.numbers[i][j]);
                        if(this.blockNumberList[this.blockNumberList.length-1]<this.numbers[i][j]) this.blockNumberList.push(this.numbers[i][j]);
                        this.score +=this.numbers[i][j];
                        document.getElementById("score").innerHTML="<p>"+this.score+"</p>";
                        new Promise((resolve)=>{
                            if(this.numbers[i][j]>128){
                                document.getElementById("x"+i+"y"+j).className="changingblock_128";
                            }else{
                                document.getElementById("x"+i+"y"+j).className="changingblock_"+this.numbers[i][j];
                            }
                            document.getElementById("x"+i+"y"+j).id="x"+i+"y"+j+"_e";
                            document.getElementById("x"+i+"y"+j+"_e").innerHTML="<p>"+this.numbers[i][j]+"</p>";
                            setTimeout(()=>{
                                resolve();
                            },150);
                        }).then(()=>{
                            setTimeout(()=>{
                                document.getElementById("x"+i+"y"+j+"_e").id="x"+i+"y"+j;
                                if(this.numbers[i][j]>128){
                                    document.getElementById("x"+i+"y"+j).className="block_128";
                                }else{
                                    document.getElementById("x"+i+"y"+j).className="block_"+this.numbers[i][j];
                                }
                            },10);
                        });
                    };
                    this.fnumbers[i][j]=0;
                }
            }
        })
        let nextflag =0;
        for(let i =0;i<4;i++){
            for(let j=0;j<4;j++){
                if(this.numbers[i][j]!=this.cash[i][j]){
                    nextflag = 1;
                }
                this.cash[i][j]=this.numbers[i][j];
            }
        }
        if(nextflag==0){
            let endflag=0;
            for(let i =0;i<4;i++){
                for(let j=0;j<4;j++){
                    if((i-1)>=0&&(this.numbers[i][j]==this.numbers[i-1][j]||this.numbers[i-1][j]==0)){
                        endflag = 1;
                    }
                    if((i+1)<4&&(this.numbers[i][j]==this.numbers[i+1][j]||this.numbers[i+1][j]==0)){
                        endflag = 1;
                    }
                    if((j-1)>=0&&(this.numbers[i][j]==this.numbers[i][j-1]||this.numbers[i][j-1]==0)){
                        endflag = 1;
                    }
                    if((j+1)>=0&&(this.numbers[i][j]==this.numbers[i][j+1]||this.numbers[i][j+1]==0)){
                        endflag = 1;
                    }
                }
            }
            if(endflag==0){
                if(document.getElementById("gamemessage_off")!=null&&document.getElementById("retrybutton_off")!=null){
                    document.getElementById("gamemessage_off").id="gamemessage_on";
                    document.getElementById("retrybutton_off").id="retrybutton_on";
                }
            }
        }else{
            this.make_newblock();
        }
        this.stragemake();
    }
    stragemake(){
        localStorage.removeItem("data");
        let stragestr = "";
        for(let i =0;i<4;i++){
            for(let j =0;j<4;j++){
                stragestr=stragestr.concat(""+this.numbers[i][j]+",");
            }
        }
        stragestr=stragestr.concat(""+this.score);
        localStorage.setItem("data",stragestr);
        console.log("str:"+stragestr);
        console.log("strage:"+localStorage.getItem('data'));
    }
    restart(){
        console.log("restart");
        localStorage.removeItem('data');
        for(let i =0;i<4;i++){
            for(let j=0;j<4;j++){
                if(document.getElementById("x"+i+"y"+j)!=null){
                    document.getElementById("x"+i+"y"+j).remove();
                }
            }
        }
        if(document.getElementById("gamemessage_on")!=null){
            document.getElementById("gamemessage_on").id="gamemessage_off";
            document.getElementById("retrybutton_on").id="retrybutton_off";
        }
        this.score =0;
        document.getElementById("score").innerHTML="<p>"+this.score+"</p>";
        this.blockNumberList=[2];
        this.numbers=new Array(3);
        for(let y = 0; y < 4; y++) {
            this.numbers[y] = new Array(4).fill(0);
        }
        this.fnumbers=new Array(3);
        for(let y = 0; y < 4; y++) {
            this.fnumbers[y] = new Array(4).fill(0);
        }
        this.cash=new Array(3);
        for(let y = 0; y < 4; y++) {
            this.cash[y] = new Array(4).fill(0);
        }
        this.make_newblock();
    }
    debug(){
        console.log("inputselect:"+this.blockNumberList);
        console.log("numbers:"+this.numbers);
        console.log("fnumbers:"+this.fnumbers);
        console.log("cash:"+this.cash);
        console.log("score:"+this.score);
        for(let j =0;j<4;j++){
            for(let i=0;i<4;i++){
                console.log("num:"+this.numbers[i][j]+" ");
                console.log("cash:"+this.cash[i][j]+" ");
            }
            console.log("\n");
        }
    }
}