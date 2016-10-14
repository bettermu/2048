/**
 * Created by Administrator on 2016/10/13.
 */


var game={
    //定义新数组
    data:null,
    //总行数
    RN:4,
    //总列数
    CN:4,
    //游戏分数
    score:0,
    //保存游戏状态
    state:0,
    //表示游戏正在进行
    RUNNING:1,
    //表示游戏结束
    GAMEOVER:0,
    //游戏暂停
    PAUSE:2,
    //初始化数组
    start:function(){
        //游戏启动时调用
        //修改游戏状态为RUNNING
        this.state=this.RUNNING;
        //初始化数组为RN行，CN列的二维数组
        //初始化空数组
        this.data=[];
        for(var r= 0;r<this.RN;r++){
            this.data[r]=[];    //初始化每一行为空数组
            for(var c=0;c<this.CN;c++){
                this.data[r][c]=0;      //初始化每一个格为0
            }
        }
        //随机生成两个2或4
        this.randomNum();
        this.randomNum();
        this.updateView();
        /*console.log(this.data.join('\n'));*/
    },

    //随机挑选一个位置，随机生成2或4
    randomNum:function(){
        //当数组不满的时候才执行
        if(!this.isFull()){
            while(true){//反复执行
                //随机生成一个行下标，保存在r中
                var r=parseInt(Math.random()*this.RN);
                //随机生成一个列下标，保存在c中
                var c=parseInt(Math.random()*this.CN);
                //如果data中 r行c列的值==0
                if(this.data[r][c]==0){
                    //随机生成2或4
                    //如果随机数<0.5 则生成2, 如果>0.5,则生成4
                    this.data[r][c]=Math.random()<0.5?2:4;
                    break;  //退出循环
                }
            }
        }
    },

    //判断数组是否已满
    isFull:function(){
        //遍历data中的每个元素
        for(var r=0;r<this.data.length;r++){
            for(var c=0;c<this.data.length;c++){
                //其中只要有一个元素==0,则立刻返回false
                if(this.data[r][c]==0){
                    return false;
                }
            }
        }
        //否则便利结束后返回true
        return true;
    },

    //将数据更新到相应视图
    updateView:function(){
        //首先遍历data里的每个元素
        for(var r=0;r<this.data.length;r++){
            for(var c=0;c<this.data.length;c++){
                var div=document.getElementById('c'+r+c);
                if(this.data[r][c]!=0){
                    div.innerHTML=this.data[r][c];
                    div.className='cell n'+this.data[r][c];
                }else{
                    div.className='cell';
                    div.innerHTML='';
                }

            }
        }
        var totle=document.getElementById('totle');
        var final=document.getElementById('finalScore');
        var over=document.getElementById('over');
        totle.innerHTML=this.score;
        final.innerHTML=this.score;
        if(this.state==this.GAMEOVER){
            over.style.display='block';
        }else{
            over.style.display='none';
        }
    },




    //左移所有行
    moveLeft:function(){
        var before=this.data.toString();
        for(var r=0;r<this.data.length;r++){
            this.moveLeftInRow(r);
        }
        var after=this.data.toString();
        //如果移动前视图不等于移动后的视图
        if(before!=after){
            //每次移动完成之后,重新加入数据
            this.randomNum();
            //判断游戏是否结束
            this.isGameOver();
            //再更新视图
            this.updateView();
        }
    },

    //左移第r行
    moveLeftInRow:function(r){
        for(var c=0;c<this.data[r].length-1;c++){
            var next=this.getRightNext(r,c);
            if(next==-1){
                break;
            }else{
                if(this.data[r][c]==0){
                    //将下一个不为0的元素值赋给当前元素
                    this.data[r][c]=this.data[r][next];
                    //将下一个元素重新归零
                    this.data[r][next]=0;
                    //下次继续从原位置开始查找
                    c--;
                }else if(this.data[r][c]==this.data[r][next]){
                    //如果当前位置等于下一个位置的值 当前位置元素值*2
                    this.data[r][c]*=2;
                    //下一个元素重新归零
                    this.data[r][next]=0;
                    //分数累加
                    this.score+=this.data[r][c];
                }
            }
        }
    },

    //找到当前位置的下一个元素
    getRightNext:function(r,c){
        for(var next=c+1;next<this.data[r].length;next++){
            if(this.data[r][next]!=0){
                return next;
            }
        }
        return -1;
    },



    //右移所有行
    moveRight:function(){
        var before=this.data.toString();
        //遍历所有行
        for(var r=0;r<this.data.length;r++){
            this.moveRightInRow(r);
        }
        var after=this.data.toString();
        if(before!=after){
            //遍历完成后更新数据和视图
            this.randomNum();
            //判断游戏是否结束
            this.isGameOver();
            this.updateView();
        }

    },

    //右移第r行
    moveRightInRow:function(r){
        for(var c=this.data[r].length-1;c>0;c--){
            var prev=this.getLeftPrev(r,c);
            if(prev==-1){
                //退出循环
                break;
            }
            else{
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[r][prev];
                    this.data[r][prev]=0;
                    c++;
                }else if(this.data[r][c]==this.data[r][prev]){
                    this.data[r][c]*=2;
                    this.data[r][prev]=0;
                    //分数累加
                    this.score+=this.data[r][c];
                }
            }
        }
    },

    //找到当前位置的上一个元素
    getLeftPrev:function(r,c){
        for(var prev=c-1;prev>=0;prev--){
            if(this.data[r][prev]!=0){
                return prev;
            }
        }
        return -1;
    },



    //上移所有行
    moveUp:function(){
        var before=this.data.toString();
        //遍历所有行
        for(var c=0;c<this.data.length;c++){
            this.moveUpInCol(c);
        }
        var after=this.data.toString();
        if(before!=after){
            //遍历完成后更新数据和视图
            this.randomNum();
            //判断游戏是否结束
            this.isGameOver();
            this.updateView();
        }
    },

    //上移第c列
    moveUpInCol:function(c){
        //遍历第c列
        for(var r=0;r<this.data.length-1;r++){
            var next=this.getDownNext(c,r);
            if(next==-1){
                break;
            }else{
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[next][c];
                    this.data[next][c]=0;
                    r--;
                }else if(this.data[r][c]==this.data[next][c]){
                    this.data[r][c]*=2;
                    this.data[next][c]=0;
                    //分数累加
                    this.score+=this.data[r][c];
                }
            }
        }

    },

    //找到下一行的当前列的元素
    getDownNext:function(c,r){
        for(var next=r+1;next<this.data.length;next++){
            if(this.data[next][c]!=0){
                return next;
            }
        }
        return -1;
    },



    //下移所有行
    moveDown:function(){
        var before=this.data.toString();
        //遍历所有行
        for(var c=0;c<this.data.length;c++){
            this.moveDownInCol(c);
        }
        var after=this.data.toString();
        if(before!=after){
            //遍历完成后更新数据和视图
            this.randomNum();
            //判断游戏是否结束
            this.isGameOver();
            this.updateView();
        }
    },

    //下移第c列
    moveDownInCol:function(c){
        for(var r=this.data.length-1;r>0;r--){
            var prev=this.getUpPrev(c,r);
            if(prev==-1){
                break;
            }else{
                if(this.data[r][c]==0){
                    this.data[r][c]=this.data[prev][c];
                    this.data[prev][c]=0;
                    r++;
                }else if(this.data[r][c]==this.data[prev][c]){
                    this.data[r][c]*=2;
                    this.data[prev][c]=0;
                    //分数累加
                    this.score+=this.data[r][c];
                }
            }
        }
    },

    //找到上一行的当前列的元素
    getUpPrev:function(c,r){
        for(var prev=r-1;prev>=0;prev--){
            if(this.data[prev][c]!=0){
                return prev;
            }
        }
        return -1;
    },



    //判断是否游戏结束
    isGameOver:function(){
        //遍历数组元素
        for(var r=0;r<this.data.length;r++){
            for(var c=0;c<this.data[r].length;c++){
                //如果当前格的元素为0，返回false
                if(this.data[r][c]==0){
                    return false;
                }else{
                    //如果当前元素不在最右侧列并且等于他的相邻元素，返回false
                    if(c!=this.data.length-1&&this.data[r][c]==this.data[r][c+1]){
                        return false;
                    }
                    //如果当前元素不在最后一行并且与同列的相邻行元素相等，返回false
                    else if(r!=this.data.length-1&&this.data[r][c]==this.data[r+1][c]){
                        return false;
                    }
                }
            }
        }
        //遍历结束
        this.state=this.GAMEOVER;
    }
};
//启动游戏
window.onload=function(){
    game.start();

    //键盘控制效果
    document.onkeydown=function(e){
        if(this.state==this.RUNNING){
            var ev=e||event;
            if(ev.keyCode==37){
                game.moveLeft();
            }else if(ev.keyCode==39){
                game.moveRight();
            }else if(ev.keyCode==38){
                game.moveUp();
            }else if(ev.keyCode==40){
                game.moveDown();
            }
        }
        
    };

    //移动端手势滑动效果
    var startX,startY,endX,endY,moveX,moveY;

    document.addEventListener('touchstart',function(e){
        startX= e.touches[0].clientX;
        startY= e.touches[0].clientY;
    },false);

    document.addEventListener('touchmove',function(e){
        endX= e.touches[0].clientX;
        endY= e.touches[0].clientY;
        moveX=endX-startX;
        moveY=endY-startY;
    },false);
    document.addEventListener('touchend',function(e){
        if(game.state==game.RUNNING){
            if(Math.abs(moveX)>100||Math.abs(moveY)>100){
                if(moveX<0&&Math.abs(moveX)>moveY){
                    game.moveLeft();
                }
                else if(moveX>0&&Math.abs(moveX)>moveY){
                    game.moveRight();
                }
                else if(moveY<0&&Math.abs(moveY)>moveX){
                    game.moveUp();
                }
                else{
                    game.moveDown();
                }
            }else{
                return false;
            }
        }else{
            return false;
        }
        
    });

    //游戏结束 点击 重新开始游戏
    var btn=document.getElementById('restart');
    var over=document.getElementById('over');
    var again=document.getElementById('again');
    var pause=document.getElementById('pause');
    var cont=document.getElementById('cont');
    var goon=document.getElementById('continue');
    btn.addEventListener('click',function(){
        game.start();
        over.style.display='none';
    },false);

    //重新开始按钮
    again.addEventListener('click',function(){
        game.start();
    },false);
    //中途暂停
    pause.addEventListener('click',function(){
        cont.style.display='block';
        game.state=game.PAUSE;
    },false);
    //继续游戏
    goon.addEventListener('click',function(){
        cont.style.display='none';
        game.state=game.RUNNING;
    },false);
}

