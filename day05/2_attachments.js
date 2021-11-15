
const fs = require('fs');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service:'Gmail',
    auth:{
        user:'jeynpyo@gmail.com',
        pass:'jane1994!@'
    },
    host:'smtp.mail.com',
    port:'465'
});

fs.readFile('uploads/puppy.png',(err,data)=>{
    if(err){
        console.log(err);
    }else{
        const mailOption = {
            from: '표제인<jeynpyo@gmail.com>',
            to : '표제인<janepyoz@naver.com>',
            subject : '대체 이걸 왜 하는거죠;',
            text :'첨부파일 전송',
            attachments:[{'filename':'puppy.png', 'streamSource':fs.createReadStream('uploads/puppy.png')}]
        };
        
        transporter.sendMail(mailOption,(err,info) =>{
            if(err){
               console.log(err);
            }else{
                console.log(info);
            }
            transporter.close();
        });
    }
});
