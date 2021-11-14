const express = require('express');
const fs = require('fs'); //파일 가져오는 모듈
const bodyParser = require('body-parser'); // post 로 데이터를 가져갈수 있도록 

const app = express();

app.engine('html', require('ejs').renderFile); //ejs파일을 html 파일형식으로 변환시켜서 사용자에게 전달하기 위해서 express에 등록시키는 코드!
app.use(bodyParser.urlencoded({extended:false}));

const module1 = require('./router/module1')(app,fs); //app,과 fs를 파라리터로 전달! 이 모듈 안에서도 express와 fs기능을 사용할 수 있게끔 한다.


app.listen(3000,() =>{
    console.log('3000번 포트로 서버 실행중...')
})
