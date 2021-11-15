const express = require('express');
const bodyParser = require('body-parser');
const static = require('serve-static');
const multer = require('multer');
const path = require('path');
const logger = require('morgan');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended:false}));
app.use('/public', static(path.join(__dirname, "public"))); 
app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(logger('dev'));

const storage = multer.diskStorage({
    destination:(res, file, callback) => {  
        callback(null,'uploads');  
    },
    filename: (req,file, callback) =>{
        const extension = path.extname(file.originalname); 
        const basename = path.basename(file.originalname, extension); 
        callback(null, basename+"_"+Date.now()+extension); 
        }
});


const upload = multer({
    storage: storage,
    limit:{
        files:1,
        filsSize:1024 * 1024 * 100 
    }
});

router.route('/mail').post(upload.array('photo',1),(req,res) =>{
    try{
        const files = req.files;
        console.log(req.files[0]);

        let originalname = '';
        let filename = '';
        let mimetype = '';
        let size = 0;

        if(Array.isArray(files)){
            console.log(`클라이언트에서 받아온 파일 개수 : ${files.length}`);

            for(let i=0; i<files.length; i++){
                originalname = files[i].originalname;
                filename = files[i].filename;
                mimetype = files[i].mimetype;
                size = files[i].size;
            }
        }
        fs.readFile('uploads/' + filename, (err,data) => {
            if(err){
                console.log(err);
            }else{
                const tomail = req.body.tomail;
                const toid = req.body.toid;
                const title = req.body.title;
                const content = req.body.content;

                const sendid = req.body.sendid;
                const sendmail = req.body.sendmail;
                
                const fmtfrom = `${sendid}<${sendmail}>`;
                const fmtto = `${toid}<${tomail}>`;

                const transporter = nodemailer.createTransport({
                    service:'Gmail',
                    auth:{
                        user:'jeynpyo@gmail.com',
                        pass:'jane1994!@'
                    },
                    host:'smtp.mail.com',
                    port:'465'
                })

                const mailOption = {
                    from: fmtfrom,
                    to: fmtto,
                    subject: title,
                    text: content,
                    attachments:[{'filename':filename,'content':data}]
                };

                transporter.sendMail(mailOption,(err,info) =>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log(info);
                        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                        res.write('<h2>메일보내기 성공</h2>');
                        res.write('<hr/>')
                        res.write(`<p>제목 : ${title}</p>`);
                        res.write(`<p>내용 : ${content}</p>`);
                        res.write(`<p>파일명 : ${filename}</p>`);
                        res.write(`<p><img src='/uploads/${filename}' width=200></p>`);
                        res.end();
                    }
                    transporter.close();
                });
            }
        })
        


    }catch(e){
        console.log(e);
    }
});




app.use('/', router); 

app.listen(3000,()=>{
    console.log('3000번 포트로 서버 동작중...')
})