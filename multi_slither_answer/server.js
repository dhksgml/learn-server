var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(8005);

app.use(express.static('public'));
console.log('연결됨');

var io = socket(server);

io.on('connection', (socket) => {
    console.log('connected');
    console.log(socket.id);

    socket.on('snakeLocation', (dataSnake) => {
        io.emit('snakeLocation', dataSnake);
    });

    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});