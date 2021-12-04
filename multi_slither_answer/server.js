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
   
    //id를 클라이언트로 보냄
    socket.emit('getId',socket.id);
   
    socket.on('snakeLocation', (dataSnake) => {
        //처음 클라이언트가 접속했을 때 지렁이에 대한 정보 추가
        if(players.length === 0){
            players.push(dataSnake);
        }else{
            //이후 클라이언트 접속 시 배열의 길이를 확인
            for(var j = 0; j < players.length; j++){
                //만약 players[j]번째 해당하는 지렁이id와 요청받은 지렁이id가 일치하면 player[j]번째에 요청받은 지렁이에 대한 정보를 넣고 for문을 종료한다.
                if(players[j].id === dataSnake.id){
                    players[j] = dataSnake;
                    break;
                }
                //만약 players 배열에 id가 일치하는 지렁이 정보가 없으면(배열의 마지막까지 반복했을 때 값이 없으면) 입력받은 지렁이 정보를 배열에 추가한다.
                if(j===players.length - 1){
                    players.push(dataSnake);
                }
            }
        }
        //새롭게 수정한 클라이언트들의 정보가 담긴 배열을 웹 소켓에 접속한 모든 플레이어들에게 보낸다.
        io.emit('snakeLocation', players);
    });

    //키 요청을 받아서 각 클라이언트에게 따로 보낸다.
    socket.on('keyEvent',(dataKey)=>{
        socket.emit('keyEvent', dataKey);
    });

    //먹이 배열에 대한 정보를 받아 모든 클라이언트에게 보낸다.
    socket.on('feedLocation', (dataFoodArr) => {
        io.emit('feedLocation', dataFoodArr);
    });

    //클라이언트 접속 종료 시 
    socket.on('disconnect', () => {
        console.log('disconnected');
        //클라이언트들의 정보를 담고 있는 players 배열의 요소 중 아이디가 일치하는 것을 삭제한다.
        players.forEach((element)=>{
            if(element.id === socket.id){
                var index = players.indexOf(element);
                players.splice(index, 1);
            }
        });
    });
});