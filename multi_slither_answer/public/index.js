'use strict';

var vcanvas, ctx;
// var r_left, r_right, r_up, r_down;
var key = {left:0,right:0,up:0,down:0}
var feedArr = []; // 먹이 배열
var SnakeArr = []; //뱀 배열
var Snake; //각각의 뱀
var scl = 10;
var socket = io();

var SnakeMove = {x:null, y:null, xv:null, yv:null}

function sendData() {
    socket.emit('snakeLocation', Snake);
}

var Snake = function() {
    this.id;
    this.x = 0;
    this.y = 0;
    this.xv = 0;
    this.yv = 0;
    this.tailArr = [];
    this.feedArr = [];

    socket.on('getId',(id) => {
        this.id = id
    })

    this.addTail = function() {
        this.tailArr.push({x:null,y:null})
    }
    
    this.updateSnake = function() {
                
        if(this.tailArr.length > 0){
            var i;
            for ( i = this.tailArr.length - 1; i > 0; i -= 1) {
                this.tailArr[i] = this.tailArr[ i-1 ]
            }
        }
        this.tailArr[0] = {x: this.x, y: this.y}
                
        this.x += this.xv * scl;
        this.y += this.yv * scl; 
            
        if( this.x < 0 ) { this.x = 0 }
        if( this.x + 10 > vcanvas.width ) { this.x = vcanvas.width - 10 }
        if( this.y < 0 ) { this.y = 0 }
        if( this.y + 10 > vcanvas.height ) { this.y = vcanvas.height - 10 }
    }

    this.dir = function( x,y ) {
        this.xv = x;
        this.yv = y;
    }


    this.drawSnake = function() {
        
        if(this.tailArr.length > 1){
            var i;
            ctx.fillStyle = "gray";
            for ( i = 0; i < this.tailArr.length-1; i++ ){
                ctx.beginPath();
                ctx.fillRect(this.tailArr[i].x, this.tailArr[i].y, scl, scl);
            }
        }

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, scl, scl);
    }
}

function gameLoop() {
    clearCanvas();
    update();
    Snake.updateSnake();

    createFeed();
    eatFeed( Snake );
    drawFeed();
    
    Snake.drawSnake();

    console.log(Snake.id)
    sendData();
}

function init() {

    vcanvas = document.getElementById('myCanvas');
    ctx = vcanvas.getContext('2d');

    Snake = new Snake();
    SnakeArr.push(Snake)


    setInterval(gameLoop,100);
    // setInterval(createFeed,100);
}


//feed
function createFeed() {
    const fx = Math.floor(Math.random() * vcanvas.width - scl)
    const fy = Math.floor(Math.random() * vcanvas.height - scl)
    const fc = "#" + parseInt(Math.random() * 0xffffff).toString(16)
    let findX, findY;

    for(let i = 0; i < feedArr.length; i++){
        findX = feedArr[i].x == fx;
        findY = feedArr[i].y == fy;
    }
    
    if(findX && findY )
    {
        return;
    }
    const newFood = { x:fx, y:fy, c:fc };
    // feedArr.push(newFood);
    socket.emit('feedLocation',newFood);
}

function drawFeed() {
    var i;
    for(i = 0; i < feedArr.length; i++){
        if(feedArr[i].x % scl == 0 && feedArr[i].y % scl == 0){
            ctx.beginPath();
            ctx.fillStyle = feedArr[i].c;
            ctx.fillRect(feedArr[i].x, feedArr[i].y, scl, scl);
        }
    }
}

function eatFeed( snake ) {
    var i;
    for(i = 0; i < feedArr.length; i++){
        if(feedArr[i].x == snake.x && feedArr[i].y == snake.y ){
            snake.addTail();
            feedArr.splice(i,1);
        }
    }
    // socket.emit('feedLocation',feedArr);
}

//Snake

function clearCanvas() {
    ctx.clearRect(0,0,vcanvas.width,vcanvas.height);
}

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

socket.on('snakeLocation', (snakeArrData) => {
    // console.log(snakeArrData[0])
    // for(let i = 0; i < snakeArrData.length; i++){
    //     if(snakeArrData.id == Snake.id){
    //         Snake.x = snakeArrData.x;
    //         Snake.y = snakeArrData.y;
    //         Snake.tailArr = snakeArrData.tailArr;
    //     }
    // }
    snakeArrData.forEach((e)=>{
        if(e.id === socket.id){
            var index = snakeArrData.indexOf(e);
            snakeArrData.splice(index,1);
            for(var j in snakeArrData){
                ctx.fillStyle = "blue"
                ctx.fillRect(snakeArrData[j].x, snakeArrData[j].y, scl, scl);
                ctx.fillStyle = "black"
            }
        }
        // Snake.x = e.x;
        // Snake.y = e.y;
        // Snake.tailArr = e.tailArr;
        // console.log(e.id)
    })
    // console.log(SnakeArr)
    
});

socket.on('getId',(dataId)=>{
    Snake.id = dataId
})
socket.on('feedLocation', (foodData) => {
    //feedArr = foodData
    const num = feedArr.findIndex((i) => {
        return i.x == foodData.x && i.y == foodData.y;
    });
    if(num == -1)
        feedArr.push(foodData);
});

socket.on('keyEvent',(keyData)=>{
    key = keyData;
});

// socket.on('sendFeed',(feedArrData)=>{
//     feedArr = feedArrData;
// })

// socket.on('snakeArr', (snakeData) => {
//     const num = SnakeArr.findIndex((i) => {
//         console.log(i.id)
//         return i.id == snakeData.id
//     });
//     if(num == -1)
//         SnakeArr.push(snakeData);
// });

