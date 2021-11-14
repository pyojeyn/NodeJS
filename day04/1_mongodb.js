const express = require('express');
const bodyParser = require('body-parser');
const mongoClient = require('mongodb').MongoClient;

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: false}));

let database;   // 몽고디비 연결 객체 전역변수

// 몽고디비 연결 함수
function connectDB(){
    const databaseURL = "mongodb://127.0.0.1:27017";
    mongoClient.connect(databaseURL, {useUnifiedTopology: true}, (err, success) => {
        if(err){
            console.log(err);
        }else{
            database = success.db('jcp');
            console.log(`mongodb 데이터베이스 연결 성공!`);

        }
    });
}

//회원가입
//http://127.0.0.1:3000/member/regist (post)

router.route('/member/regist').post((req,res) =>{
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const gender = req.body.gender;

    console.log(`userid:${userid}, userpw:${userpw}, name:${name}, gender:${gender}`);

    if(database){
        joinMember(database, userid, userpw, name, gender, (err,result) =>{
            if(err){
                res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                res.write('<h2>회원가입 실패!</h2>');
                res.write('<p>가입중 오류가 발생했습니다.</p>');
                res.end();
            }else{
                if(result.insertedCount > 0){
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
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다.</p>');
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
        loginMember(database, userid, userpw, (err,result) =>{
            if(err){
                res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>로그인 실패!</h2>');
                    res.write('<p>로그인 중 오류 발생!</p>');
                    res.end();
            }else{
                if(result){
                    const result_userid = result[0].userid; //밑에 함수가 toArray로 배열로 보내기 때문
                    const result_userpw = result[0].userpw;
                    const result_name = result[0].name;
                    const result_gender = result[0].gender;

                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>로그인 성공!</h2>');
                    res.write(`<p>아이디 :${result_userid}</p>`);
                    res.write(`<p>비밀번호 :${result_userpw}</p>`);
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


// 정보수정
//http://127.0.0.1:3000/member/edit (put)
router.route('/member/edit').put((req,res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const gender = req.body.gender;

    console.log(`userid:${userid}, userpw:${userpw}, name:${name}, gender:${gender}`);

    if(database){
        editMember(database, userid, userpw, name, gender, (err,result) =>{
            if(err){
                res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>회원정보 수정 실패!</h2>');
                    res.write('<p>수정 중 오류 발생!</p>');
                    res.end();
            }else{
                if(result.modifiedCount > 0){
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>회원정보 수정 성공!</h2>');
                    res.write('<p>회원정보 수정이 성공적으로 완료되었습니다.</p>');
                    res.end();
                }else{
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>회원정보 수정 실패!</h2>');
                    res.write('<p>회원정보 수정이 실패했습니다.</p>');
                    res.end();
                }
            }
        });
    }
});

// 회원삭제
//http://127.0.0.1:3000/member/delete (delete)
router.route('/member/delete').delete((req,res)=>{
    const userid = req.body.userid;

    console.log(`userid:${userid}`);
    if(database){
        deleteMember(database, userid, (err,result) =>{
            if(err){
                res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                res.write('<h2>회원 삭제 실패!</h2>');
                res.write('<p>삭제 중 오류 발생!</p>');
                res.end();
            }else{
                if(result.deletedCount > 0){
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>회원삭제 성공!</h2>');
                    res.write('<p>회원삭제가 성공적으로 완료되었습니다.</p>');
                    res.end();
                }else{
                    res.writeHead('200', {'content-type':'text/html; charset=utf8'});
                    res.write('<h2>회원정보 삭제 실패!</h2>');
                    res.write('<p>회원삭제에 실패했습니다.</p>');
                    res.end();
                }
            }
        });
    }
});


const joinMember = function(database, userid, userpw, name, gender, callback){
    const members = database.collection('member');
    members.insertMany([{userid:userid, userpw:userpw, name:name, gender:gender}], (err,result) =>{
        if(err){
            console.log(err);
            return;
        }else{
            if(result.insertedCount > 0){
                console.log(`사용자 document ${result.insertedCount} 명이 추가되었습니다` );
            }else{
                console.log(`사용자 document가 추가되지 않았음`);
            }
            callback(null,result);
        }
    }); //뒤에가 파라미터임 앞에는 몽고디비 필드
}

const loginMember = function(database, userid, userpw, callback){
    const members = database.collection('member');
    members.find({userid:userid,userpw:userpw}).toArray((err,result) =>{
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

const editMember = function(database, userid, userpw, name, gender, callback){
    const members = database.collection('member');
    members.updateOne({userid:userid}, {$set:{userid:userid, userpw:userpw, name:name, gender:gender}}, (err, result) => {
        if(err){
            console.log(err);
            callback(err, null);
            return;
        }else{
            if(result.modifiedCount > 0){
                console.log(`사용자 document ${result.modifiedCount}명 수정되었습니다`);
            }else{
                console.log(`수정된 document가 없습니다`);
            }
            callback(null, result);
        }
    });
}

const deleteMember = function(database, userid, callback){
    const members = database.collection('member');
    members.deleteOne({userid:userid}, (err,result)=>{
        if(err){
            console.log(err);
            callback(err,null);
            return; //써주면 좋다
        }else{
            if(result.deletedCount > 0){
                console.log(`사용자 document ${result.deletedCount}명 삭제되었습니다.`);
            }else{
                console.log(`삭제된 document 가 없습니다.`);
            }
            callback(null,result);
        }
    });
}

app.use("/", router);

app.listen(3000, () => {
    console.log('3000번 포트로 서버 동작중 ...');
    connectDB();
});
