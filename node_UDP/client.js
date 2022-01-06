var PORT = 8000;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var message = Buffer.from(JSON.stringify({pos:[1.7,2.3,5.5],nick:"ASDF"}));

var client = dgram.createSocket('udp4');
client.send(message, 0, message.length, PORT, HOST, function(err, bytes){
    if(err) throw err;
    console.log('UDP message sent to '+HOST+':'+PORT);
    // client.close();
});

client.on('message',function(message,remote){
    let msg = JSON.parse(message.toString('utf-8'));
    console.log(msg);
    // console.log(msg.nick)
})
