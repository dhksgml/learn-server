var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(8005);
var players = [];


app.use(express.static('public'));
console.log('연결됨');

var io = socket(server);

io.on('connection', (socket) => {
    console.log('connected');
    // console.log(socket.id);

    // id = socket.id;
    // console.log(id)
   
    socket.emit('getId',socket.id);
    // if(id.length == 0){
    //     id.push(socket.id)
    //     socket.emit('getId',id[0]);
    // }
    
    // id.forEach(function(e){
    //     if(e === socket.id){
    //         var index = id.indexOf(e);
    //         io.emit('getId',id[index])
    //     }
    // })
        
    
    // socket.on('snakeArr',(dataSnake)=>{
    //     io.emit('snakeArr', dataSnake)
    // })

    // socket.emit('sendFeed', (dataFood)=>{
    //     io.emit('sendFeed', dataFood);
    // })
    

    socket.on('snakeLocation', (dataSnake) => {
        // console.log(id)
        if(players.length === 0){
            players.push(dataSnake);
        }else{
            for(var j = 0; j < players.length; j++){
                if(players[j].id === dataSnake.id){
                    players[j] = dataSnake;
                    break;
                }
                if(j===players.length - 1){
                    players.push(dataSnake);
                }
            }
            
        }
        io.emit('snakeLocation', players);
    });

    socket.on('keyEvent',(dataKey)=>{
        socket.emit('keyEvent', dataKey);
    });

    socket.on('feedLocation', (dataFood) => {
        io.emit('feedLocation', dataFood);
    });

    

    socket.on('disconnect', () => {
        console.log('disconnected');
        players.forEach((element)=>{
            if(element.id === socket.id){
                var index = players.indexOf(element);
                players.splice(index, 1);
            }
        });
    });
});