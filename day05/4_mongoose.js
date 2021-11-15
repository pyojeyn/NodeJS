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
    const name = req.body.name;
    const gender = req.body.gender;

    console.log(`userid:${userid}, userpw:${userpw}, name:${name}, gender:${gender}`);

    if(database){
        joinMember(userid, userpw, name, gender, (err,result) =>{
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
});

//로그인
//http://127.0.0.1:3000/member/login (post)
router.route('/member/login').post((req,res) =>{
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`userid:${userid}, userpw:${userpw}`);

    if(database){
        loginMember(userid, userpw, (err,result) =>{
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
});


app.use('/', router);

function connectDB(){
    const uri = "mongodb://127.0.0.1:27017/jcp";
    mongoose.Promise = global.Promise;
    mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology:true}); //연결
    database = mongoose.connection; //연결 정보를 데이터 정보에 담아줌
    database.on('error',console.error.bind(console, "mongoose 연결 실패!"));
    database.on('open', ()=>{ //아 오타 진짜 ;;
        console.log('데이터베이스 연결 성공!');
        UserSchema = mongoose.Schema({ //여기서 타입 직접 정해줌 테이블 만드는것과 유사하다.
            userid:String,
            userpw:String,
            name:String,
            gender:String
        });
        console.log('UserSchema 생성 완료!');
        UserSchema.static('findAll',function(callback){
            return this.find({},callback);
        });

        UserModel = mongoose.model('user',UserSchema);
        console.log('UserModel이 정의됨!')
        
        
    });
}

//회원 리스트 
//http://127.0.0.1:3000/list (get)
router.route('/list').get((req,res) =>{
    if(database){
        UserModel.findAll((err,result) =>{
            if(err){
                console.log('리스트 조회 실패!')
                return;
            }else{
                if(result){
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>회원 리스트</h2>');
                    res.write('<div><ul>');
                    console.log(result.length);
                    for(let i=0; i<result.length; i++){
                        const userid = result[i].userid;
                        const name = result[i].name;
                        const gender = result[i].gender;
                        res.write(`<li>${i+1} : ${userid} / ${name} / ${gender}</li>`);
                    }

                    res.write('</ul></div>');
                    res.end();
                }else{ //회원 없을때 
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>정보 없음</h2>');
                    res.write('<p>회원 정보가 없습니다.</p>');
                    res.end();
                }
            }
        });   // GET /list%20 404 1.502 ms - 146 와 포스트맨 주소 마지막에 띄어쓰기 했다고 GET /list%20 404 1.502 ms - 146 이딴 에러남;;;
    }else{
        res.writeHead('200', {'content-type':'text/html; charset=utf8'});
        res.write('<h2>데이터베이스 연결실패!</h2>');
        res.write('<p>데이터베이스에 연결하지 못했습니다.</p>');
        res.end();
    }    
});






const joinMember = function(userid, userpw, name, gender, callback){
    const members = new UserModel({userid:userid,userpw:userpw, name:name, gender:gender});
    members.save((err,result)=>{
        if(err){
            console.log(err);
            callback(err,null);
            return;
        }else{
            callback(null, result);
        }
    });
}

const loginMember = function(userid, userpw, callback){
   
    UserModel.find({userid:userid, userpw:userpw}, (err,result) =>{
        if(err){
            console.log(err);
            callback(err,null);
        }else{
            if(result.length > 0){
                console.log('사용자가 있음');
                callback(null,result);
            }else{
                console.log('일치하는 사용자가 없음');
                callback(null,null);
            }
        }
    });
}



app.listen(3000,()=>{
    console.log('3000번 포트로 실행중...')
    connectDB();
})

