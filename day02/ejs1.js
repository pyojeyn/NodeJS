const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');

const app = express();
const router = express.Router();


app.use(bodyParser.urlencoded({extended:false}));

router.route('/about').post((req, res) =>{
    fs.readFile('./ejs1.ejs', 'utf-8', (err,data) => {
        if(err){
            console.log(err);
        }else{
            res.writeHead(200,{'content-type':'text/html'});
            res.end(ejs.render(data)); // data 안에 있는 ejs파일을 html 화 시켜서 렌더링 시켜서 사용자에게 전달!
        }
    })
});


app.use('/', router); //router를 express미들웨어에 등록 

app.all('*',(req,res)=>{ //혹시라도 다른 페이지를 호출하게 된다면 
    res.status(404).send('<p>페이지를 찾을 수 없습니다.</p>');
});

app.listen(3000, () => {
   console.log('3000번 포트로 서버 실행중 ...');
});