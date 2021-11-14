const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();

app.use(cookieParser());

app.get('/setCookie',(req,res) => {
    console.log('setCookie 호출 ! ');
    res.cookie('member', {
        id:'apple',
        name:'김사과',
        gender : '여자'
        }, {
            maxAge:1000 *60 *3
        });
        res.redirect('/showCookie');
});

app.get('/showCookie',(req,res) =>{
    console.log('showCookie 호출!');
    res.send(req.cookies);
    res.end();
});

app.listen(3000,()=>{
    console.log('3000번 포트로 서버 실행중...');
});