class Main{
    constructor(element){
        this.element=element;
        this.score =0;
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
        let inputnum = 2;/*要調整*/
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
    }
    deba(){
        for(let j =0;j<4;j++){
            for(let i=0;i<4;i++){
                console.log("num:"+this.numbers[i][j]+" ");
                console.log("cash:"+this.cash[i][j]+" ");
            }
            console.log("\n");
        }
    }
}