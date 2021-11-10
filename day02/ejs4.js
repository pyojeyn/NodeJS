const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const ejs = require('ejs');

const app = express();
const router = express.Router();


app.use(bodyParser.urlencoded({extended:false}));

router.route('/').get((req, res) =>{
    try{
        const head = fs.readFileSync('./index.ejs','utf8');
        const body = fs.readFileSync('./body.ejs','utf8');

        const index = ejs.render(head, {title:"매개변수로 전달될 제목!", content:ejs.render(body, {message:"매개변수로 전달된 text 메세지"})});
        res.end(index);
    }catch(e){
        console.log(e);
    }
});



app.use('/', router); //router를 express미들웨어에 등록 

app.all('*',(req,res)=>{ //혹시라도 다른 페이지를 호출하게 된다면 
    res.status(404).send('<p>페이지를 찾을 수 없습니다.</p>');
});

app.listen(3000, () => {
   console.log('3000번 포트로 서버 실행중 ...');
});