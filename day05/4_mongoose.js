const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');


const app = express();
const router = express.Router();
app.use(bodyParser.urlencoded({extended:false}));
app.use(logger('dev'));


let database;
let UserSchema;
let UserModel;

//http://127.0.0.1:3000/member/regist (post)
router.route('/member/regist').post((req,res)=>{
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name= req.body.name;
    const gender = req.body.gender;

    console.log(`userid:${userid}, userpw:${userpw}, name:${name}, gender:${gender}`);

    if(database){
        joinMember(userid, userpw, name, gender, (err,result)=>{
            if(err){
                res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                res.write('<h2>회원가입 실패!</h2>');
                res.write('<p>가입중 오류가 발생했습니다.</p>');
                res.end();
            }else{
                if(result){
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>회원가입 성공!</h2>');
                    res.write('<p>회원가입이 성공적으로 완료되었습니다!</p>');
                    res.end(); 
                }else{
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>회원가입 실패!</h2>');
                    res.write('<p>회원가입에 실패했습니다.</p>');
                    res.end();
                }
            }
        })
    }else{
        res.writeHead('200', {'content-type':'text/html; charset=utf8'});
        res.write('<h2>데이터베이스 연결실패!</h2>');
        res.write('<p>데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
})

//로그인
//http://127.0.0.1:3000/member/login (post)
router.route('/member/login').post((req,res)=>{
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`userid:${userid}, userpw:${userpw}`);

    if(database){
        loginMember(userid,userpw,(err,result)=>{
            if(err){
                res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                res.write('<h2>로그인 실패!</h2>');
                res.write('<p>로그인 중 오류 발생!</p>');
                res.end();
            }else{
                if(result){
                    const result_name = result[0].name;
                    const result_gender = result[0].gender;

                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>로그인 성공!</h2>');
                    res.write(`<p>아이디 :${userid}</p>`);
                    res.write(`<p>비밀번호 :${userpw}</p>`);
                    res.write(`<p>이름 :${result_name}</p>`);
                    res.write(`<p>성별 :${result_gender}</p>`);
                    res.end();
                }else{
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>로그인 실패!</h2>');
                    res.write('<p>아이디 또는 비밀번호가 틀렸습니다.</p>');
                    res.end();
                }
            }
        })
    }else{
        res.writeHead('200', {'content-type':'text/html; charset=utf8'});
        res.write('<h2>데이터베이스 연결실패!</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
})

//회원수정
//http://127.0.0.1:3000/member/edit (put)
router.route('/member/edit').put((req,res)=>{
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name= req.body.name;
    const gender = req.body.gender;
    if(database){
    editMember(userid,userpw,name,gender,(err,result)=>{
        if(err){
            res.writeHead('200', {'content-type':'text/html; charset=utf8'});
            res.write('<h2>회원수정 실패!</h2>');
            res.write('<p>오류 발생!</p>');
            res.end();
        }else{
            if(result){
                res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                res.write('<h2>회원수정 성공!</h2>');
                res.write('<p>회원수정이 성공적으로 완료되었습니다!</p>');
                res.end(); 
            }else{
                res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                res.write('<h2>회원가입 실패!</h2>');
                res.write('<p>회원가입에 실패했습니다.</p>');
                res.end();
            }
        }
    })
}else{
        res.writeHead('200', {'content-type':'text/html; charset=utf8'});
        res.write('<h2>데이터베이스 연결실패!</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
})

//회원삭제
//http://127.0.0.1:3000/member/delete (delete)
router.route('/member/delete').delete((req,res)=>{
    const userid = req.body.userid;
    if(database){
        deleteMember(userid,(err,result)=>{
            if(err){
                res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                res.write('<h2>회원삭제 실패!</h2>');
                res.write('<p>오류 발생!</p>');
                res.end();
            }else{
                if(result){
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>회원삭제 성공!</h2>');
                    res.write('<p>회원삭제가 성공적으로 완료되었습니다!</p>');
                    res.end(); 
                }else{
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>회원삭제 실패!</h2>');
                    res.write('<p>회원삭제에 실패했습니다.</p>');
                    res.end();
                }
            }
        })
    }else{
        res.writeHead('200', {'content-type':'text/html; charset=utf8'});
        res.write('<h2>데이터베이스 연결실패!</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
})


app.use('/', router);
function connectDB(){
    const url = "mongodb://127.0.0.1:27017/jcp";
    mongoose.Promise = global.Promise; //데이터처리를 동기처리로 바꿔서 해당 툴에 데이터가 하나씩 잘 들어가도록 전역으로 설정
    mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology:true }); //연결
    database = mongoose.connection; //연결정보 database에 담아줌
    //on() : 이벤트 연결 (제이쿼리랑 비슷)
    database.on('error',console.error.bind(console,"mongoose 연결 실패"));
    database.on('open',()=>{
        console.log('데이터베이스 연결 성공!');
        UserSchema = mongoose.Schema({ //규약 만들기
            userid:String,
            userpw:String,
            name:String,
            gender:String
        });
        console.log('UserSchema 생성 완료!');
        // static() : UserSchema를 만들고 findAll 이라는 가상 함수를 만듬
        // findAll이란 함수를 쓰게 되면 옆에 있는 함수가 호출되면서 callabck을 되돌려줌
        // UserSchema = this
        // this.find({},callback); -> UserSchema의 모든 데이터를 다 뽑아와서 리턴! {}만 쓰면 다 리턴해줌
        UserSchema.static('findAll',function(callback){
            return this.find({},callback);
        });
        UserModel = mongoose.model('user',UserSchema);
        console.log('UserModel이 정의됨!')
    })
}

//회원 리스트 
//http://127.0.0.1:3000/list (get)
router.route('/list').get((req,res)=>{
    if(database){
        UserModel.findAll((err,result)=>{
            if(result){
            res.writeHead('200',{'content-type':'text/html; charset=utf8'});
            res.write('<h2>회원 리스트</h2>');
            res.write('<div></ul>');
            console.log(result.length);
            for(let i=0; i<result.length; i++){
                const userid = result[i].userid;
                    const name = result[i].name;
                    const gender = result[i].gender;
                    res.write(`<li>${i+1} : ${userid} / ${name} / ${gender}</li>`);
            }
            res.write('</ul></div>');
            res.end();
        }else{
            res.writeHead('200', {'content-type':'text/html; charset=utf8'});
            res.write('<h2>정보 없음</h2>');
            res.write('<p>회원 정보가 없습니다.</p>');
            res.end();
        }
        })
    }else{
        res.writeHead('200', {'content-type':'text/html; charset=utf8'});
        res.write('<h2>데이터베이스 연결실패!</h2>');
        res.write('<p>데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }
})

const joinMember = function(userid,userpw,name,gender,callback){
    // db.collection('users')가 아니라 new UserModel! UserModel객체 만들어줌
    const members = new UserModel({userid:userid,userpw:userpw,name:name,gender:gender});
    members.save((err,result)=>{
        if(err){
            console.log(err);
            callback(err,null);
            return;
        }else{
            callback(null,result);
        }
    });
}

const loginMember = function(userid,userpw,callback){
    UserModel.find({userid:userid,userpw:userpw},(err,result)=>{
        if(err){
            console.log(err);
            callback(err,null);
        }else{
            if(result.length > 0){
                console.log('사용자 있음!');
                callback(null,result);
            }else{
                console.log('일치하는 사용자가 없음');
                callback(null,null);
            }
        }
    })
}
//회원 수정 ! 
const editMember =function(userid,userpw,name,gender,callback){
    const member = UserModel.find({userid:userid}); // find()메소드 사용 : userid로 찾아냄
    member.updateMany({userid:userid,userpw:userpw,name:name,gender,gender},(err,result)=>{
        if(err){
            console.log(err);
            callback(err,null);
            return;  
        }else{
            callback(null,result);
            console.log('회원정보 수정 성공!')
        }
    });
}

//회원 삭제
const deleteMember = function(userid,callback){
    const member = UserModel.find({userid:userid});
    member.deleteOne({userid:userid},(err,result)=>{
        if(err){
            console.log(err);
            callback(err,null);
            return;
        }else{
            callback(null,result);
            console.log('회원삭제 성공!')
        }
    })
}

app.listen(3000,()=>{
    console.log('3000번 포트로 실행중...')
    connectDB();
})