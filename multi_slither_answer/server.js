var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(8005);

app.use(express.static('public'));
console.log('연결됨');

var io = socket(server);

io.on('connection', (socket) => {
    console.log('connected');
    // console.log(socket.id);

    
    socket.emit('getId',{id:socket.id})

    // socket.on("sendId", (data) => {
    //     console.log(data)
    //     socket.emit('getId',data);
    // })

    // socket.on("first Request", req => {
    //     console.log(req);
    //     socket.emit('first Respond', {data: 'firstRespond'});
    // })

    
    socket.on('keyEvent',(dataKey)=>{
        io.emit('keyEvent',dataKey);
    })

    socket.on('sendSnakeArr',(dataSnakeArr)=>{
        io.emit('getSnakeArret',dataSnakeArr);
    })

    socket.on('snakeLocation', (dataSnake) => {
        io.emit('snakeLocation', dataSnake);
    });

    socket.on('feedLocation', (dataFood) => {
        io.emit('feedLocation', dataFood);
    });


    socket.on('disconnect', () => {
        console.log('disconnected');
    });
});