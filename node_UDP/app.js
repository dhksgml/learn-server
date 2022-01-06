let PORT = 8000;
let HOST = '127.0.0.1';

let dgram = require('dgram');
let server = dgram.createSocket('udp4');

let player = function() {
    this.IPAddress;
    this.port;
    this.nickName;
    this.location;
}

//player
let playerList = []; //[new player()];
let nPlayer;

//임시 플레이어 정보
// playerList[0].IPAddress = "127.0.0.1";
// playerList[0].port = 7000;
// playerList[0].nickName = "aaaa";
// playerList[0].location = [1.0, 2.2, 7.1];

server.on('listening', function(){
    let address = server.address();

    nPlayer = new player();
    console.log('UDP Server listeming on '+ address.address + ':' + address.port);
});

server.on('message', function(message, remote){
    console.log(remote.address + ':'+ remote.port + " - " + message);

    let msg = JSON.parse(message.toString('utf-8'))

    nPlayer.nickName = msg.nick;
    nPlayer.location = msg.pos;
    nPlayer.IPAddress = remote.address;
    nPlayer.port = remote.port;
        
    if(playerList.length == 0){
        playerList.push(nPlayer);
    }else{
        for(let i = 0; i < playerList.length; i++){
            if(playerList[i].nickName != nPlayer.nickName){
                playerList.push(nPlayer)
            }else if(playerList[i].nickName == nPlayer.nickName){
                playerList[i] = nPlayer
            }
        }
    }

    let sendData = JSON.stringify(playerList);
    console.log(playerList)
    // console.log("IPAddress: "+nPlayer.IPAddress+" port: "+nPlayer.port+" nickName: "+nPlayer.nickName+ " location: "+nPlayer.location)

    playerList.forEach((i) => {
        server.send(sendData, 0, sendData.length, i.port, i.IPAddress, function(err, bytes){
            if(err) throw err;
            console.log("sendData - " + sendData);
        })
    })
});


server.bind(PORT,HOST);