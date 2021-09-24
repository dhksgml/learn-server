arr = [{gamename:"test",data:[{nickName:"A",score:80,rank:1}]}];

function A(gameName,nickname,Score)
{
    //1.배열 안에 gameName이 있나? 없으면 false return !hint: 반복문, find, findIndex
    arr.findIndex((i)=>{
        if(i.gamename==gameName)
        {
            // console.log("게임이름 있어요");
            //2.있으면 data를 돌며 nickName이 있나 확인  !hint: 반복문
            i.data.findIndex((j)=>{
                if(j.nickName==nickname)
                {
                    // console.log("닉네임 있어요");
                    //3.nickName있으면, score만 업데이트
                    j.score = 100;
                    
                }
                else{
                    //4.없으면 data에 {nickName:nickname,score:score,rank:0}을 push 
                    i.data.push({nickName:nickname,score:Score,rank:0});
                    
                }
            });
        }
        else{
            // console.log("그런 게임은 없어요");
            return false;
        }
    });
    
}


A("test","A",80);
A("lol","B",80);
A("test","C",90);

arr.forEach((i) => {
    i.data.forEach((j)=>{
        console.log(j);
    })
});

// console.log(arr.data);
