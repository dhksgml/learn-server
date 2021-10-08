const express = require('express');
const path = require('path');
const fs = require("fs");
const morgan = require('morgan');
const csv = require('csv-parser');
// const { send } = require('process');




const rCsv = fs.createReadStream('./csv/data.csv').pipe(csv())
    rCsv.on('data',(data)=>results.push(data))
    // .on('headers',(headers)=>{
    //     console.log(`First header: ${headers[1]}`)
    // })
    rCsv.on('end',()=>{
        console.log(results);
    });

// const createCsvWriter = require('csv-writer').createObjectCsvWriter;
// const csvWriter = createCsvWriter({
//     path: './csv/data.csv',
//     header: [
//         // [{id:'id', title:'id'},
//         // {id:'gameName', title:'gameName'},
//         // {id:'userId',title:'userId'},
//         // {id:'password',title:'password'}
//         ['id','gameName','userId','password']
//     ]
// });

const results = [];
var idArr = [];
// var results1 = [];

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({ extended: true }));




// app.post('/login',async (req,res,next)=>{
//     try{
//         //조회
//     //1. req.body.id & req.body.password & req.body.gameName
//     //2. DB에서 req.body.gameName findOne
//     //3. req.body.id가 db에 있는지 확인 ->
//     //4. 3번의 id랑 pw 일치 확인
//     //5. 일치하면 닉네임 반환 or "Error"반환
//         // var searchInfo = await User.findOne({ 
//         //     where: { [Op.and]:{gameName: req.body.gameName,
//         //         userId: req.body.userId, 
//         //         password: req.body.password} 
//         //     } 
//         // });
//         rCsv.on('data',(data)=>results1.push(data));
        

        
        
//         // 요청받은 gameName,userId,password를 모두 만족하는 컬럼이 있으면 다음 처리
//         if(searchInfo.gameName)
//         {
//             // console.log("게임이름 같음");
//             // var searchID = await User.findOne({ where:{userId: req.body.userId}});
//             // if(searchID){
//                 console.log(searchInfo.userId);
//             if(searchInfo.userId){
//                 // console.log("아이디가 있습니다.");
//                 var searchPassword = await User.findOne({
//                     where:{[Op.and]:{password: req.body.password,userId: req.body.userId}}
//                 });                    
//                 if(searchPassword){
//                     // console.log("로그인 성공!");
//                     res.send(req.body.gameName+": "+req.body.userId);
                    
//                 }
//                 else{
//                     // console.log("비밀번호가 다릅니다.");
//                     res.send("Error");
//                 }
//             }
//             else{
//                 console.log("그런 아이디는 없습니다.");
//                 res.send("Error");
//             }
//         }
//     }
//     catch(error){
//         console.error(error);
//         next(error);
//     }

// });

app.post('/register',async (req,res,next)=>{
    //등록
    //1. req.body.id & req.body.password & req.body.gameName
    //2. DB에서 req.body.gameName findOne
    //3. push {pw:pw,nick:nick}
    //4. 결과 true false 반환

    try{
        // 요청받은 gameName과 userId가 csv파일안에 없다면 값을 추가한다.
        // var searchGame = await User.findOne({ where: { [Op.and]:{gameName: req.body.gameName,userId: req.body.userId} } });
        // if(!searchGame){
        //     const exUser = await User.create({
        //         gameName: req.body.gameName,
        //         userId: req.body.userId,
        //         password: req.body.password
        //     });
        // }
        
        // res.send(null);
        // console.log(results[0].gameName);        
      
        rCsv.on('data',(data)=>results.push(data))
        rCsv.on('end',()=>{
            console.log(results);
        });

        // console.log(results[0]);
        if(results[0]==null){
            //없다
            console.log("없다");
            results.push({id:req.body.id,gameName:req.body.gameName,userId:req.body.userId,password:req.body.password});
            console.log(results);
                    
            var content =  results; 
            fs.writeFile('./csv/data.csv', JSON.stringify(content), 'utf8', function(error)
            { console.log('write end') });
        }
        
        for(var i = 0; i < results.length; i++)
        {
            // console.log(results[i].gameName);
            if(results[i].gameName==req.body.gameName){
                // console.log("게임 이미 있음");
                
                if(results[i].gameName==req.body.gameName && results[i].userId==req.body.userId)
                {
                    console.log("아이디 있음");
                    
                    break;
                    
                } else {
                    
                    //아이디 없음
                    console.log('새로 등록함');
                    results.push({id:req.body.id,gameName:req.body.gameName,userId:req.body.userId,password:req.body.password});
                    // console.log(results);
                    var content = results; 
                    fs.writeFile('./csv/data.csv', JSON.stringify(content), 'utf8', function(error)
                    { console.log('write end') });
                    
                    break

                }
            }

        }


        // for(let i = 0; results.length; ++i){
        //     console.log(results[i+1].userId);
        //     console.log(req.body.userId);
        //     if(results[i+1].gameName == req.body.gameName ){
        //         //게임 이름이 있는 경우
        //         // console.log(results[i].gameName);
        //         if(results[i+1].userId==req.body.userId){
        //             await console.log("유저 아이디 있어요");
        //             break;
        //         }
        //         else{

        //             await console.log('유저가 없어요. id를 등록합니다.');
        //             results.push({id:req.body.id, gameName:req.body.gameName, userId:req.body.userId, password:req.body.password});
        //             // csvWriter.writeRecords(results)       // returns a promise
        //             //     .then(() => {
        //             //         console.log('...Done');
        //             //     });
    
        //             // console.log(results);

        //             // results1 = [];
        //             break;
        //         }
        //         // break;
        //     }
        //     else{
        //         //게임 이름 없는 경우(데이터 push)
        //         results.push([req.body.id, req.body.gameName, req.body.userId, req.body.password]);
        //         console.log(results);
                
        //         var data = results; 
        //         await fs.writeFile('./csv/data.csv', data, 'utf8', function(error)
        //         { console.log('write end') });

        //         break;
        //     }
        // }
        res.send(results);
    }
    catch(error)
    {
        console.error(error);
        res.send(false);
        next(error);
    };
     
});


app.listen("8605",()=>{
    console.log('8605번 포트에서 대기 중..');
});