
/*
문제 : login.html (로그인) 을 생성하고 아이디와 비밀번호를 넣고 서버로 보내면 아래와 같이 출력되는 node.js파일을 생성

로그인 정보 
userid : banana
userpw : 0000
*/
// 필요한 모듈 express, fs, body-parser

const express = require('express');
const fs = require('fs'); //html 파일 읽어내려면 무조건 ! 
const bodyParser = require('body-parser'); //post 요청 무조건! 
const { request } = require('http');

const app = express();
app.use(bodyParser.urlencoded({extended:false}));

app.get('/login', (req,res) => {
    //페이지 html 파일 읽을라면 fs.readFile 필요함
    fs.readFile('login.html',(err,data) => {
        if(err){
            console.log(err);
        }else{
            res.writeHead(200,{'content-type':'text'})
            res.end(data); // 데이타 보내기 ~ 
        }
    });
});

app.post('/login', (req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`userid:${userid}, userpw:${userpw}`);

    res.writeHead(200, {'content-type' : 'text/html; charset=utf-8'});
    res.write(`<h2>로그인 정보</h2>`);
    res.write(`<p>userid :${userid}</p>`);
    res.write(`<p>userpw :${userpw}</p>`);
    res.end();
});

app.listen(3000, () => {
    console.log('3000번 포트로 서버 실행중...');
});