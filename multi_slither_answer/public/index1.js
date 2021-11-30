'use strict';
var vcanvas, ctx;
var r_left, r_right, r_up, r_down, sp;
var s;
var scl = 20;
var food = {x: null, y: null};
var socket = io();

function sendData() {
  socket.emit('snakeLocation', s);
}

function Snake() {
    this.x = 0;
    this.y = 0;
    this.xspeed = 0;
    this.yspeed = 0;
    this.tail = [];     // new

    this.update = function () {
        // new -----------------
        var i;

        for (i = this.tail.length - 1; i > 0; i -= 1) {
            this.tail[i] = this.tail[i - 1];
        }
        this.tail[0] = {x: this.x, y: this.y};

        this.x += this.xspeed * scl;
        this.y += this.yspeed * scl;
        // -----------------------

        if (this.x < 0) { this.x = 0; }
        if (this.x + scl > vcanvas.width) { this.x = vcanvas.width - scl; }
        if (this.y < 0) { this.y = 0; }
        if (this.y + scl > vcanvas.height) { this.y = vcanvas.height - scl; }
    };

    this.eat = function (pos) {
        var dx = this.x - pos.x, dy = this.y - pos.y, d;

        d = Math.sqrt(dx * dx + dy * dy);
        if (d < 1) {
            this.tail.push({x: null, y: null});     // new
            return true;
        } else {
            return false;
        }
    };

    this.dir = function (x, y) {
        this.xspeed = x;
        this.yspeed = y;
    };

    this.draw = function () {
        // new -----------------
        var i;

        ctx.fillStyle = 'gray';
        for (i = 0; i < this.tail.length - 1; i += 1) {
            ctx.fillRect(this.tail[i].x, this.tail[i].y, scl, scl);
        }
        // --------------------

        ctx.fillStyle = 'black';
        ctx.fillRect(this.x, this.y, scl, scl);
    };
    //밑으로 뺌
}

function clearCanvas() {
    ctx.clearRect(0, 0, vcanvas.width, vcanvas.height);
}

function pickLocation() {
    var cols, rows;

    cols = Math.floor(vcanvas.width / scl);
    rows = Math.floor(vcanvas.height / scl);

    food.x = Math.floor(Math.random() * cols) * scl;
    food.y = Math.floor(Math.random() * rows) * scl;
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, scl, scl);
}

function update() {
    if (r_left) { s.dir(-1, 0); }
    if (r_right) { s.dir(1, 0); }
    if (r_up) { s.dir(0, -1); }
    if (r_down) { s.dir(0, 1); }
}

function gameLoop() {
    clearCanvas();
    update();
    s.update();
    if (s.eat(food)) { pickLocation(); }
    drawFood();
    s.draw();
    sendData();
}

function init() {
    vcanvas = document.getElementById("myCanvas");
    ctx = vcanvas.getContext("2d");
    s = new Snake();
    pickLocation();

    setInterval(gameLoop, 80);
}

// key control

function set_key() {
    r_left = r_right = r_up = r_down = 0;

    if (event.keyCode === 37) { r_left = 1; }
    if (event.keyCode === 39) { r_right = 1; }
    if (event.keyCode === 38) { r_up = 1; }
    if (event.keyCode === 40) { r_down = 1; }

    if (event.keyCode === 32) { sp = 1; }
}

document.onkeydown = set_key;

//sockets

socket.on('snakeLocation', (snakeData) => {
  s.x = snakeData.x;
  s.y = snakeData.y;
  s.tail = snakeData.tail;
});