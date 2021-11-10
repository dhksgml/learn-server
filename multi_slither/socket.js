const SocketIO = require('socket.io');

let SnakeArr;
let userId; //처음 접속한 유저 아이디 저장
let isFirstUser = false; //토글 (처음 유저가 접속했는지 여부)

module.exports = (server) => {
    const io = SocketIO(server, {path: '/socket.io'});

    io.on('connection', (socket) => {
       
        const req = socket.request;
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.ip);
        //처음 접속 유저가 접속하면 socket.id를 저장함.
        if(isFirstUser==false){
            userId = socket.id;
        }
        //토글을 사용하여 다른 아이디를 받지 않게 함.
        isFirstUser=true;

        socket.on('disconnect', () =>{
            console.log('클라이언트 접속 해제', ip, socket.id);
            //유저 접속 해제 시, 처음 유저 아이디와 동일하면 다시 처음 유저 아이디를 받을 수 있게 토글을 false로 바꿈
            if(socket.id == userId){
                isFirstUser = false;
            }
            clearInterval(socket.interval);
        });
        socket.on('error',(error)=>{
            console.error(error);
        })
        socket.on('reply',(data)=>{
            // console.log(userId)
            // console.log(data)

            //처음 유저 아이디와 동일할 때만 데이터 삽입
            if(userId == data.id){
                SnakeArr = data;
            }
            

            // console.log(SnakeArr);
        })
        socket.interval = setInterval(()=>{
            // socket.broadcast.emit('news',SnakeArr);
            socket.emit('news',SnakeArr);
        }, 3000);
    });
};