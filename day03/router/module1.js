module.exports = (app,fs) => {
    app.get('/',(req,res)=>{
        console.log('/호출');
        res.render('index.ejs');
    })

    app.get('/about',(req,res)=>{
        console.log('/about 호출');
        res.render('about.ejs');
    })

    app.get('/list',(req,res)=>{
        fs.readFile(__dirname + "/../data/member.json", "utf-8",(err,data)=>{
            if(err){
                console.log(err);
            }else{
                console.log(data);
                res.writeHead(200, {'content-type':'text/html; charset=utf-8'});
                res.end(data);
            }
        })
    });

    //http://127.0.0.1:3000/joinMember/avocado  회원가입시키기
    app.post('/joinMember/:userid',(req,res)=>{
        const result = {}; 
        const userid = req.params.userid //post 방식인데 url로 담아서 보내는거는 body아님!! ※params임!!
        // password속성의값과, name속성의 값이 없으면.
        if(!req.body["password"] || !req.body["name"]){
            result["code"] = 100; // result 객체에 code라는 속성을 만들어 100을 넣어주고
            result["message"] = "매개변수가 전달되지 않음"; //message라는 속성을 만들어 message를 넣어주고
            res.json(result); //result를 json으로 변환해서 사용자에게 보내준다.
            return false; // 진행을 멈춤
        }
        //data 폴더 안에 있는 member.json을 읽어와서 
        fs.readFile(__dirname + "/../data/member.json","utf-8",(err,data)=>{
            if(err){
                console.log(err);
            }else{ // 상수 member에다 member.json의 내용을 json으로 변환해서 넣어준다.
                const member = JSON.parse(data);
                if(member[userid]){ //만약 member의 userid속성의 값이랑 똑같은게 있다면
                    result["code"] = 101;
                    result["msg"] = "중복된 아이디임";
                    res.json(result);
                    return false;
                }
                
                // 찐 회원가입
                member[userid] = req.body; // member[avocado]
                fs.writeFile(__dirname+"/../data/member.json",JSON.stringify(member,null,'\t'),'utf8',(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        result["code"] = 200;
                        result["msg"] = "성공";
                        res.json(result);
                    }
                });

            }
        })
    });
    //정보수정
    //http://127.0.0.1:3000/updateMember/avocado
    app.put('/updateMember/:userid',(req,res)=>{
        const result ={};
        const userid = req.params.userid;

        if(!req.body["password"] || !req.body["name"]){
            result["code"] = 100;
            result["message"] = "매개변수가 전달되지 않음";
            res.json(result); //json 형태로 보냄?
            return false;
        }

        //만약 매개변수를 잘 전달 받았으면 파일 읽어서 그 안에 userid 넘어온 값있나 찾아보는거임
        fs.readFile(__dirname +"/../data/member.json","utf-8", (err,data)=>{
            if(err){
                console.log(err);
            }else{
                const member = JSON.parse(data);
                member[userid] = req.body;
                fs.writeFile(__dirname +"/../data/member.json",JSON.stringify(member,null,'\t'),'utf8',(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        result["code"] = 200;
                        result["msg"] = "성공"
                        res.json(result);
                    }
                })
            }
        })
    });

    //회원삭제 
    //http://127.0.0.1:3000/deleteMember/avocado
    app.delete('/deleteMember/:userid',(req,res)=>{
        const result = {};
        fs.readFile(__dirname+"/../data/member.json", "utf-8",(err,data)=>{
            if(err){
                console.log(err);
            }else{
                const member = JSON.parse(data);
                if(!member[req.params.userid]){
                    result["code"] = 102;
                    result["msg"] = "사용자를 찾을 수 없음";
                    res.json(result);
                    return false;
                }
                delete member[req.params.userid];
                fs.writeFile(__dirname+"/../data/member.json",JSON.stringify(member,null,'\t'),'utf8',(err,data)=>{
                    if(err){
                        console.log(err);
                    }else{
                        result["code"] = 200;
                        result["msg"] = "성공";
                        res.json(result);
                    }
                });
            }
        });
    });
}