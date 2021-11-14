const express = require('express');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({extended:false}));
app.use(expressSession({
    secret:'!@#$%^&*()',
    resave: false,
    saveUninitialized: false
}));

app.get('/login', (req, res) => {
    fs.readFile('login.html', 'utf8', (err, data) => {
        if(err){
            console.log(err);
        }else{
            res.writeHead(200, {'content-type':'text/html'});
            res.end(data);
        }
    });
});

//http://127.0.0.1:3000/login
app.post('/login',(req,res) =>{
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    console.log(`userid:${userid}, userpw:${userpw}`);

    if(userid =='admin' && userpw == '1234'){
        req.session.member = {
            id:userid,
            pw:userpw,
            isauth: true
        };
        res.redirect('/main');
    }else{
        res.redirect('/login');
    }
});

app.get('/main', (req, res) => {
    console.log(req.session.member);
    if(req.session.member){
        fs.readFile('main.html', 'utf8', (err, data) => {
            if(err){
                console.log(err);
            }else{
                res.writeHead(200, {'content-type':'text/html'});
                res.end(data);
            }
        });
    }else{
        res.redirect('/login');
    }
});


app.get('/logout',(req,res) =>{
    req.session.destroy( () =>{
        console.log('세션이 삭제되었습니다.');
    });
    res.redirect('./login');
})

app.listen(3000,() =>{
    console.log('3000번 포트로 서버 실행중...')
})