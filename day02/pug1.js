const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const ejs = require('pug');
const path = require('path');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended:false}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

router.route('/daum').get((req, res) =>{
    res.render('pug1');
});

app.use('/', router); //router를 express미들웨어에 등록 

app.all('*',(req,res)=>{ //혹시라도 다른 페이지를 호출하게 된다면 
    res.status(404).send('<p>페이지를 찾을 수 없습니다.</p>');
});

app.listen(3000, () => {
   console.log('3000번 포트로 서버 실행중 ...');
});