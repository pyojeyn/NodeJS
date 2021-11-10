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