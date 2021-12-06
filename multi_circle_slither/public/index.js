'use strict';

var vcanvas, ctx;
var key = {left:0,right:0,up:0,down:0}  //조작키
var feedArr = [];                       //먹이 배열
var SnakeArr = [];                      //뱀 배열
var Snake;                              //클라이언트 자신의 뱀 객체
var scl = 20;                           //뱀의 크기
var socket = io();                      //html에서 경로 지정한 웹 소켓 생성
//추가
var degree = 0;                         //클라이언트의 뱀이 바라보고 있는 각도

//클라이언트 뱀에 대한 정보를 서버로 보내는 함수
function sendData() {
    socket.emit('snakeLocation', Snake); //서버에 있는 snakeLocation 이벤트 실행
}

//클라이언트 뱀 객체
var Snake = function() {
    this.id;            //아이디
    this.x = scl/2;         //뱀의 x좌표
    this.y = scl/2;         //뱀의 y좌표

    this.tailArr = [];      //뱀 꼬리
    this.isDie = false;     //뱀이 죽었는지 판단
    this.d = 0;             //뱀이 바라보고 있는 각도
    this.speed = 10;         //뱀의 속도
    
    // this.setRadian = function(degrees){
    //     if(degrees < 0) degrees = 0
    //     if(degrees > 360) degrees = 360 
    //     return 2*Math.PI*(degrees/360);
    // };

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
        // if(this.radian < 0) this.radian = 0;
        // if(this.radian > 360) this.radian = 360;
        // this.x += this.xv * scl/2;
        
        // this.x += Math.cos(this.radian) * scl/2;
        // this.y += this.yv * scl/2; 
        // this.y += Math.sin(this.radian) * scl/2;

        this.d = degree / 180 * Math.PI;                //현재 뱀의 각도(디그리 -> 라디안 단위로 변경(Math.cos()나 Math.sin()은 라디안 단위 사용하기 때문))
        this.x += Math.cos(this.d) * this.speed         //뱀의 다음 x좌표 = COS{각도} * 속도 (삼각함수를 이용함)
        this.y += Math.sin(this.d) * this.speed         //뱀의 다음 y좌표 = sin{각도} * 속도 (삼각함수를 이용함)
            
        //맵 밖으로 나가지 않도록 보정
        if( this.x - scl/2 < 0 ) { this.x = scl/2 }
        if( this.x + 10 > vcanvas.width ) { this.x = vcanvas.width - scl/2 }
        if( this.y - scl/2 < 0 ) { this.y = scl/2 }
        if( this.y + 10 > vcanvas.height ) { this.y = vcanvas.height - scl/2 }
    
        
    }

    //방향을 지정하는 함수
    // this.dir = function() {

    //     if(key.left)
    //     this.radian += 1;
    //     if(key.right)
    //     this.radian -= 1;
    // }
    

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
        // ctx.fillRect(snakeIndex.tailArr[i].x, snakeIndex.tailArr[i].y, scl, scl);
        ctx.beginPath();
        ctx.arc(snakeIndex.tailArr[i].x, snakeIndex.tailArr[i].y, scl/2, 0, Math.PI * 2)
        ctx.fill();
    }

    if(snakeIndex.id === Snake.id){
        ctx.fillStyle = "black";
    }
    else{
        ctx.fillStyle = "blue";
    }
    // ctx.fillRect(snakeIndex.x, snakeIndex.y, scl, scl);
    
    

    ctx.save();
    ctx.translate(snakeIndex.x, snakeIndex.y)
    ctx.rotate(snakeIndex.d)

    ctx.beginPath();
    ctx.arc(0, 0, scl/2, 0, Math.PI * 2)
    ctx.fill();

    ctx.fillStyle = "red"
    ctx.beginPath();
    ctx.arc(5, -3, 2, 0, Math.PI * 2)
    ctx.arc(5, 3, 2, 0, Math.PI * 2)
    ctx.fill();

    ctx.restore();

    
}


//게임의 프레임마다 실행시키는 함수
function gameLoop() {
    var i = 0;
    sendData();                     //지렁이 데이터를 서버로 보냄
    clearCanvas();                  //화면 지우기
    
    // createFeed();                   //먹이 생성
    drawFeed();                     //먹이 그리기
    eatFeed( Snake );               //지렁이가 먹이 먹었는지 확인해서 먹으면 삭제
    
    die()
    for(i; i<SnakeArr.length; i++)  //지렁이 배열에 있는 모든 지렁이 그리기(본인 아이디면 검정, 아니면 파랑으로 그림)
    { 
        drawSnake(SnakeArr[i]);
    }

    update();                       //키 입력을 받아 방향 설정
    Snake.updateSnake();            //변경된 위치 적용

    
}


function init() {

    vcanvas = document.getElementById('myCanvas');
    ctx = vcanvas.getContext('2d');

    Snake = new Snake();            //새로운 지렁이 생성
    SnakeArr.push(Snake)            //지렁이 배열에 추가
    setInterval(createFeed,1000);
    setInterval(gameLoop,100);      //게임 루프
}

//gameEvent
function die() {
    for(let i = 0; i < SnakeArr.length; i++){
        
        if(Snake.id != SnakeArr[i].id){
            // if(Snake.x == SnakeArr[i].x && Snake.y == SnakeArr[i].y){
            //상대 머리에 닿으면 둘 다 사망
            if(Math.sqrt(Math.pow(Snake.x - SnakeArr[i].x , 2) + Math.pow(Snake.y - SnakeArr[i].y , 2)) < scl/2 + scl/4){
                Snake.isDie = true;
                socket.on('Die',Snake);
                break
            }
            //상대 꼬리에 닿으면 자신 사망
            for(let j = 0; j < SnakeArr[i].tailArr.length; j++){
                if(Math.sqrt(Math.pow(Snake.x - SnakeArr[i].tailArr[j].x , 2) + Math.pow(Snake.y - SnakeArr[i].tailArr[j].y , 2)) < scl/2 + scl/4){
                    Snake.isDie = true;
                    socket.on('Die',Snake);
                    break
                }
            }
            
        }
        
    }
}


//feed

//먹이 생성하는 함수
function createFeed() {
    const isCreate = Math.floor(Math.random() * 2)

    if(isCreate || feedArr.length > 20){
        return
    }
    const fx = Math.floor(Math.random() * (vcanvas.width - scl/2))       //먹이의 x값 랜덤 설정
    const fy = Math.floor(Math.random() * (vcanvas.height - scl/2))      //먹이의 y값 랜덤 설정
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
    if(fx-scl/2 > 0 && fx + scl/2 < vcanvas.width && fy-scl/2 > 0 && fy+scl/2 < vcanvas.height){
        const newFood = { x:fx, y:fy, c:fc };   //먹이 배열에 없으면 새로운 객체 생성
        feedArr.push(newFood);                  //먹이 배열에 생성한 객체 추가
        socket.emit('feedLocation',feedArr);    //먹이 배열을 서버로 보낸다.
    }
    
}


//먹이를 그려주는 함수
function drawFeed() {
    var i;
    for(i = 0; i < feedArr.length; i++)     //먹이 배열 길이 만큼 반복
    {               
        ctx.fillStyle = feedArr[i].c;
        ctx.beginPath();
        ctx.arc(feedArr[i].x, feedArr[i].y, scl/4, 0, Math.PI * 2);
        ctx.fill();

    }
}

//먹이를 먹었을 때 처리하는 함수
function eatFeed( snake ) {
    var i;
    for(i = 0; i < feedArr.length; i++){    
        if( Math.pow((feedArr[i].x - snake.x),2) + Math.pow((feedArr[i].y - snake.y),2) < Math.pow((scl/4 + scl/2),2)){    //지렁이 x,y 값이 먹이 x,y값과 일치하면
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
    // if(key.left) { Snake.dir(-1,0)}
    // if(key.right) { Snake.dir(1,0)}
    // if(key.up) { Snake.dir(0,-1)}
    // if(key.down) { Snake.dir(0,1)}

    if(key.left) { degree -= 10}
    if(key.right) { degree += 10}

    if(degree < 0) degree = 360
    else if(degree > 360) degree = 0
}



//key control

function set_key(event) {
    if(event.keyCode === 37 ) {  key.left = 1 }
    if(event.keyCode === 39) {  key.right= 1 }

    socket.emit('keyEvent',key);
}

function stop_key(event){
    if(event.keyCode === 37 ) {  key.left = 0 }
    if(event.keyCode === 39) {  key.right= 0 }

    socket.emit('keyEvent',key);
}
document.onkeydown = set_key;
document.onkeyup = stop_key;


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




