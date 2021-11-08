const SocketIO = require('socket.io');

const isSnakeArr = [];
let isConnected = false;

module.exports = (server) => {
    const io = SocketIO(server, {path: '/socket.io'});

    io.on('connection', (socket) => {
       
        if(isConnected==true){
            return;
        }
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        isConnected = true;

        socket.on('disconnect', () =>{
            console.log('클라이언트 접속 해제', ip, socket.id);
            clearInterval(socket.interval);
            isConnected = false;
        });
        socket.on('error',(error)=>{
            console.error(error);
        })
        socket.on('reply',(data)=>{
            // console.log(data);
            isSnakeArr[0] = data;
            console.log(isSnakeArr)
        })
        socket.interval = setInterval(()=>{
            socket.emit('news',isSnakeArr[0]);
        }, 500);
    });
};