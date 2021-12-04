'use strict';

var vcanvas, ctx;
// var r_left, r_right, r_up, r_down;
var key = {left:0,right:0,up:0,down:0}  //조작키
var feedArr = [];                       //먹이 배열
var SnakeArr = [];                      //뱀 배열
var Snake;                              //클라이언트 자신의 뱀 객체
var scl = 10;                           //뱀의 크기
var socket = io();                      //html에서 경로 지정한 웹 소켓 생성

//클라이언트 뱀에 대한 정보를 서버로 보내는 함수
function sendData() {
    socket.emit('snakeLocation', Snake); //서버에 있는 snakeLocation 이벤트 실행
}

//클라이언트 뱀 객체
var Snake = function() {
    this.id;            //아이디
    this.x = 0;         //뱀의 x좌표
    this.y = 0;         //뱀의 y좌표
    this.xv = 0;        //뱀의 x축 방향
    this.yv = 0;        //뱀의 y축 방향
    this.tailArr = [];  //뱀 꼬리
    this.isDie = false;

    //서버에서 id를 받아오기 위한 이벤트 - (this.id 선언할 때 soket.io로 초기화 하면 실행 순서 때문에 undefined 값이 들어감)
    socket.on('getId',(id) => {
        this.id = id
    })

    //꼬리를 증가시키는 함수
    this.addTail = function() {
        this.tailArr.push({x:null,y:null})
    }
    
    //지렁이 위치를 변경해주는 함수
    this.updateSnake = function() {
        //꼬리 위치 변경
        if(this.tailArr.length > 0){
            var i;
            for ( i = this.tailArr.length - 1; i > 0; i -= 1) {
                this.tailArr[i] = this.tailArr[ i-1 ]
            }
        }
        this.tailArr[0] = {x: this.x, y: this.y}
         
        //머리 위치 변경
        this.x += this.xv * scl;
        this.y += this.yv * scl; 
            
        //맵 밖으로 나가지 않도록 보정
        if( this.x < 0 ) { this.x = 0 }
        if( this.x + 10 > vcanvas.width ) { this.x = vcanvas.width - 10 }
        if( this.y < 0 ) { this.y = 0 }
        if( this.y + 10 > vcanvas.height ) { this.y = vcanvas.height - 10 }
    
        
    }

    //방향을 지정하는 함수
    this.dir = function( x,y ) {
        this.xv = x;
        this.yv = y;
    }


}

//지렁이를 그리는 함수 - 지렁이 배열의 요소 인덱스를 매개변수로 받아서 아이디가 같으면 검정색, 아니면 파란색으로 그려줌
function drawSnake(snakeIndex) {
    var i;
    if(snakeIndex.id === Snake.id){
        ctx.fillStyle = "gray";
    }
    else{
        ctx.fillStyle = "skyblue";
    }    
    var i;
    for ( i = 0; i < snakeIndex.tailArr.length-1; i++ ){
        ctx.fillRect(snakeIndex.tailArr[i].x, snakeIndex.tailArr[i].y, scl, scl);
    }

    if(snakeIndex.id === Snake.id){
        ctx.fillStyle = "black";
    }
    else{
        ctx.fillStyle = "blue";
    }
    ctx.fillRect(snakeIndex.x, snakeIndex.y, scl, scl);
}

//게임의 프레임마다 실행시키는 함수
function gameLoop() {
    var i = 0;
    sendData();                     //지렁이 데이터를 서버로 보냄
    clearCanvas();                  //화면 지우기
    
    createFeed();                   //먹이 생성
    drawFeed();                     //먹이 그리기
    eatFeed( Snake );               //지렁이가 먹이 먹었는지 확인해서 먹으면 삭제
    

    for(i; i<SnakeArr.length; i++)  //지렁이 배열에 있는 모든 지렁이 그리기(본인 아이디면 검정, 아니면 파랑으로 그림)
    { 
        drawSnake(SnakeArr[i]);
    }

    update();                       //키 입력을 받아 방향 설정
    Snake.updateSnake();            //변경된 위치 적용

    die()
}


function init() {

    vcanvas = document.getElementById('myCanvas');
    ctx = vcanvas.getContext('2d');

    Snake = new Snake();            //새로운 지렁이 생성
    SnakeArr.push(Snake)            //지렁이 배열에 추가
    setInterval(gameLoop,100);      //게임 루프
}

//gameEvent
function die() {
    for(let i = 0; i < SnakeArr.length; i++){
        for(let j = 0; j < SnakeArr[i].tailArr.length; j++){
            if(Snake.id != SnakeArr[i].id){
                if(Snake.x == SnakeArr[i].tailArr[j].x && Snake.y == SnakeArr[i].tailArr[j].y){
                    Snake.isDie = true;
                    alert("사망!!")
                }
            }
        }
    }
}


//feed

//먹이 생성하는 함수
function createFeed() {
    const fx = Math.floor(Math.random() * vcanvas.width - scl)       //먹이의 x값 랜덤 설정
    const fy = Math.floor(Math.random() * vcanvas.height - scl)      //먹이의 y값 랜덤 설정
    const fc = "#" + parseInt(Math.random() * 0xffffff).toString(16) //먹이의 색상 랜덤 설정
    let findX, findY;   //먹이 배열에서 중복된 값 있는지 판단하기 위한 변수 생성

    for(let i = 0; i < feedArr.length; i++){
        findX = feedArr[i].x == fx;
        findY = feedArr[i].y == fy;
    }
    
    if(findX && findY ) //이미 먹이 배열에 x와 y값이 동일한 중복된 값이 있으면 값을 추가하지 않는다.
    {
        return;
    }
    const newFood = { x:fx, y:fy, c:fc };   //먹이 배열에 없으면 새로운 객체 생성
    feedArr.push(newFood);                  //먹이 배열에 생성한 객체 추가
    socket.emit('feedLocation',feedArr);    //먹이 배열을 서버로 보낸다.
}

//먹이를 그려주는 함수
function drawFeed() {
    var i;
    for(i = 0; i < feedArr.length; i++)     //먹이 배열 길이 만큼 반복
    {               
        if(feedArr[i].x % scl == 0 && feedArr[i].y % scl == 0) //일정한 간격을 만족하는 먹이만 그린다.
        {
            ctx.fillStyle = feedArr[i].c;
            ctx.fillRect(feedArr[i].x, feedArr[i].y, scl, scl);
        }
        else{
            feedArr.splice(i,1)   //아니면 삭제
        }
    }
}

//먹이를 먹었을 때 처리하는 함수
function eatFeed( snake ) {
    var i;
    for(i = 0; i < feedArr.length; i++){    
        if(feedArr[i].x == snake.x && feedArr[i].y == snake.y ){    //지렁이 x,y 값이 먹이 x,y값과 일치하면
            snake.addTail();                                        //꼬리 추가
            feedArr.splice(i,1);                                    //먹이 삭제
        }
    }
    socket.emit('feedLocation',feedArr);                            //먹이가 삭제된 배열을 서버로 보냄
}



//화면 지워주는 함수
function clearCanvas() {
    ctx.clearRect(0,0,vcanvas.width,vcanvas.height);

}
//Snake

//뱀의 방향 설정
function update() {
    if(key.left) { Snake.dir(-1,0)}
    if(key.right) { Snake.dir(1,0)}
    if(key.up) { Snake.dir(0,-1)}
    if(key.down) { Snake.dir(0,1)}
}



//key control

function set_key(event) {
    //r_left = r_up = r_down = r_right = 0;
    key.left = key.right = key.up = key.down = 0;

    if(event.keyCode === 37 ) {  key.left = 1 }
    if(event.keyCode === 38 ) { key.up = 1 }
    if(event.keyCode === 39) {  key.right= 1 }
    if(event.keyCode === 40) { key.down = 1 }

    socket.emit('keyEvent',key);
}
document.onkeydown = set_key;


//socket 

//서버의 뱀 배열 자체를 받아와서 클라이언트의 뱀 배열에 저장
socket.on('snakeLocation', (snakeArrData) => {
    SnakeArr = snakeArrData;
    
    // snakeArrData.forEach((e)=>{
    //     if(e.id === Snake.id){
    //         var index = snakeArrData.indexOf(e);
    //         snakeArrData.splice(index,1);
    //         for(var j in snakeArrData){
    //             ctx.fillStyle = "blue"
    //             ctx.fillRect(snakeArrData[j].x, snakeArrData[j].y, scl, scl);
    //         }
    //     }
    // })
    
});

//서버의 먹이 배열 자체를 받아와서 클라이언트의 먹이 배열에 저장
socket.on('feedLocation', (foodArrData) => {
    feedArr = foodArrData
    // const num = feedArr.findIndex((i) => {
    //     return i.x == foodData.x && i.y == foodData.y;
    // });
    // if(num == -1)
    //     feedArr.push(foodData);
});

//서버에서 키 데이터를 받아서 클라이언트의 키에 적용
socket.on('keyEvent',(keyData)=>{
    key = keyData;
});




