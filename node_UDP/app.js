let PORT = 8000;
let HOST = '127.0.0.1';

let dgram = require('dgram');
let server = dgram.createSocket('udp4');

server.on('listening', function(){
    let address = server.address();
    console.log('UDP Server listeming on '+ address.address + ':' + address.port);
});

server.on('message', function(message, remote){
    console.log(remote.address + ':'+ remote.port + " - " + message);

    let sendMessage = "Your IP : " + remote.address + ":" + remote.port + ", Your Message : " + message;

    server.send(sendMessage, 0, sendMessage.length, remote.port, remote.address, function(err, bytes){
        if(err) throw err;
        console.log(sendMessage);
    })
});



server.bind(PORT,HOST);