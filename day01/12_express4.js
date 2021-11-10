
// post 요청 매개변수 받기

const express = require('express');
const bodyParser = require('body-parser'); //post 하려면 필수!

const app = express(); //거의 미들웨어 등록하려고 express 객체 만드는 수준임; 

app.use(bodyParser.urlencoded({extended:false}));  //body-parser 미들웨어로 등록! 
app.post('/login',(req,res) =>{ 
    //req.body.변수명 이것만 외우기 ! 
    const userid = req.body.userid;
    const userpw = req.body.userpw; 

    console.log(`userid : ${userid}`);
    console.log(`userpw : ${userpw}`);

    //사용자에게 화면으로 응답해줘야하니까 res.write! / writeHead는 head 속성? 
    res.writeHead(200, {'content-type' :'text/html; charset=utf-8'});
    res.write(`<h2>익스프레스 서버에서 응답한 메세지 입니다. </h2>`);
    res.write(`<p>userid :${userid}</p>`);
    res.write(`<p>userpw :${userpw}</p>`);
    res.end();
});
//http://127.0.0.1:3000/login
app.listen(3000, () => {
    console.log('3000번 포트로 서버 실행중...');
});