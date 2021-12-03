'use strict';

var vcanvas, ctx;
var r_left, r_right, r_up, r_down;
var feedArr = []; // 먹이 배열
var SnakeArr = []; //뱀 배열
var Snake; //각각의 뱀
var scl = 10;
var socket = io();

var SnakeMove = {x:null, y:null, xv:null, yv:null}

function sendData() {
    socket.emit('snakeLocation', Snake);
}

function init() {

    vcanvas = document.getElementById('myCanvas');
    ctx = vcanvas.getContext('2d');

    // Snake = new Snake();
    // SnakeArr.push(Snake);

    setInterval(gameLoop,100);
}


//feed
function createFeed() {
    const fx = Math.floor(Math.random() * vcanvas.width - scl)
    const fy = Math.floor(Math.random() * vcanvas.height - scl)
    const fc = "#" + parseInt(Math.random() * 0xffffff).toString(16)
    const findX = feedArr.indexOf(fx);
    const findY = feedArr.indexOf(fy);
    if(findX != -1 && findY != -1)
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

var Snake = function() {
    this.x = 0;
    this.y = 0;
    this.xv = 0;
    this.yv = 0;
    this.tailArr = [];
    this.feedArr = [];

    this.updateSnake = function() {
                
        var i;
        for ( i = this.tailArr.length - 1; i > 0; i -= 1) {
            this.tailArr[i] = this.tailArr[ i-1 ]
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

    this.addTail = function() {
        this.tailArr.push({x:null,y:null})
    }

    this.drawSnake = function() {
        var i;
        for ( i = 0; i < this.tailArr.length-1; i++ ){
            ctx.beginPath();
            ctx.fillStyle = "gray";
            ctx.fillRect(this.tailArr[i].x, this.tailArr[i].y, scl, scl);
        }

        ctx.fillStyle = "black";
        ctx.fillRect(this.x, this.y, scl, scl);
    }
}


function clearCanvas() {
    ctx.clearRect(0,0,vcanvas.width,vcanvas.height);
}

function update() {
    if(r_left) { Snake.dir(-1,0)}
    if(r_right) { Snake.dir(1,0)}
    if(r_up) { Snake.dir(0,-1)}
    if(r_down) { Snake.dir(0,1)}
}

function gameLoop() {
    clearCanvas();
    createFeed();
    eatFeed( Snake );
    drawFeed();
    
    Snake.drawSnake();
    update();
    Snake.updateSnake();
    sendData();
}


//key control

function set_key(event) {
    r_left = r_up = r_down = r_right = 0;

    if(event.keyCode === 37 ) {  r_left = 1 }
    if(event.keyCode === 38 ) { r_up = 1 }
    if(event.keyCode === 39) {  r_right= 1 }
    if(event.keyCode === 40) { r_down = 1 }
}
document.onkeydown = set_key;


//socket 

socket.on('snakeLocation', (snakeData) => {
    // console.log(snakeData)
    Snake.x = snakeData.x;
    Snake.y = snakeData.y;
    Snake.tailArr = snakeData.tailArr;

});

socket.on('feedLocation', (foodData) => {
    //feedArr = foodData
    const num = feedArr.findIndex((i) => {
        return i.x == foodData.x && i.y == foodData.y;
    });
    if(num == -1)
        feedArr.push(foodData);
});


socket.on('getId', (snakeId) => {
    const num = SnakeArr.findIndex((i) => {
        return SnakeArr[i].id == snakeId.id;
    });
    if(num == -1 ){
        Snake = new Snake();
        Snake.id = snakeId.id;
        SnakeArr.push(Snake);
        socket.emit('sendSnakeArr',SnakeArr);
    }
    
    // console.log(num)
    // console.log(snakeId.id);
    // console.log(Snake.id);
});

socket.on('getSnakeArr',(dataSnakeArr)=>{
    SnakeArr = dataSnakeArr;
    console.log(SnakeArr)
})


// socket.on('first Respond', req => {
//     console.log(req);
// });

// socket.on('snakeArr',(id)=>{
//     console.log(id);
// })
// socket.on('snakeArr', (snakeData) => {
//     const num = SnakeArr.findIndex((i) => {
//         return i.id == snakeData.id
//     });
//     if(num == -1)
//         SnakeArr.push(snakeData);
// });

