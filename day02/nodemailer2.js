const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const nodemailer = require('nodemailer');
const { application } = require('express');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended:false}));

router.route('/mail').get((req, res) => {
    fs.readFile('mail.html', 'utf8', (err, data) => {
        if(err){
            console.log(err);
        }else{
            res.writeHead(200, {'content-type':'text/html'});
            res.end(data);
        }
    });
});

router.route('/mail').post((req, res) => {
    const sendid = req.body.sendid;
    const sendmail = req.body.sendmail;
    const toid = req.body.toid;
    const tomail = req.body.tomail;
    const title = req.body.title;
    const content = req.body.content;

    const fmtfrom = `${sendid}<${sendmail}>`;         // 류정원<ryuzy1011@gmai.com>
    const fmtto = `${toid}<${tomail}>`;

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user:'jeynpyo@gmail.com',
            pass:'jane1994!@'
        },
        host: 'smtp.mail.com',
        port: '465'
    });

    const mailOption = {
        from: fmtfrom,
        to: fmtto,
        subject: title,
        html: content
    };

    transporter.sendMail(mailOption, (err, info) => {
        if(err){
            console.log(err);
        }else{
            console.log(info);
        }
        transporter.close();
    });
});

app.use('/', router);
app.all('*', (req, res) => {
    res.status(404).send('<h2>페이지를 찾을 수 없습니다.</h2>');
});

app.listen(3000, () => {
    console.log('3000번 포트로 서버 실행중 ...');
});



const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:'jeynpyo@gmail.com',
        pass:'jane1994!@'
    },
    host:'smtp.mail.com',
    port:'465'
});

const mailOption = {
    from: '표제인<jeynpyo@gmail.com>',
    to : '표제인<janepyoz@naver.com>',
    subject : '대체 이걸 왜 하는거죠;',
    text :'프로젝트는 끝낼수 있을까; 취업은 할수 있을까 ㅎ'
};

transporter.sendMail(mailOption,(err,info) =>{
    if(err){
       console.log(err);
    }else{
        console.log(info);
    }
    transporter.close();
});

