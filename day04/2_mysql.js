const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const logger = require('morgan');
const config = require('./config/config.json');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended: false}));
app.use(logger('dev'));

// db연결 및 pool 설정
const pool = mysql.createPool(config);

// 회원가입
// http://127.0.0.1:3000/member/regist (post)
router.route('/member/regist').post((req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;
    const name = req.body.name;
    const hp = req.body.hp;
    const email = req.body.email;
    const hobby = req.body.hobby;
    const ssn1 = req.body.ssn1;
    const ssn2 = req.body.ssn2;
    const zipcode = req.body.zipcode;
    const address1 = req.body.address1;
    const address2 = req.body.address2;
    const address3 = req.body.address3;    

    console.log(`userid:${userid}, userpw:${userpw}, name:${name}, hp:${hp}, email:${email}, hobby:${hobby}, ssn1:${ssn1}, ssn2:${ssn2}, zipcode:${zipcode}, address1:${address1}, address2:${address2}, address3:${address3}`);

    if(pool){
        joinMember(userid, userpw, name, hp, email, hobby, ssn1, ssn2, zipcode, address1, address2, address3, (err, result) => {
            if(err){
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 실패!</h2>');
                res.write('<p>가입중 오류가 발생했습니다</p>');
                res.end();
            }else{
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>회원가입 성공!</h2>');
                res.write('<p>회원가입이 성공적으로 완료되었습니다</p>');
                res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패!</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다</p>');
        res.end();
    }
});

// 로그인
// http://127.0.0.1:3000/member/login (post)
router.route('/member/login').post((req, res) => {
    const userid = req.body.userid;
    const userpw = req.body.userpw;

    console.log(`userid:${userid}, userpw:${userpw}`);

    if(pool){
        loginMember(userid, userpw, (err, result) => {
            if(err){
                res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                res.write('<h2>로그인 실패!</h2>');
                res.write('<p>로그인 오류가 발생했습니다</p>');
                res.end();
            }else{
                    const mem_idx = result[0].mem_idx;
                    const mem_userid = result[0].mem_userid;
                    const mem_name = result[0].mem_name;

                    res.writeHead('200', {'content-type':'text/html;charset=utf8'});
                    res.write('<h2>로그인 성공!</h2>');
                    res.write(`<p>번호 : ${mem_idx}</p>`);
                    res.write(`<p>아이디 : ${mem_userid}</p>`);
                    res.write(`<p>이름 : ${mem_name}</p>`);
                    res.end();
            }
        });
    }else{
        res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패!</h2>');
        res.write('<p>mongodb 데이터베이스에 연결하지 못했습니다</p>');
        res.end();
    }
});

const joinMember = function(userid, userpw, name, hp, email, hobby, ssn1, ssn2, zipcode, address1, address2, address3, callback){
    pool.getConnection((err, conn) => {
        if(err){
            console.log(err);
        }else{
            const sql = conn.query('insert into tb_member(mem_userid, mem_userpw, mem_name, mem_hp, mem_email, mem_hobby, mem_ssn1, mem_ssn2, mem_zipcode, mem_address1, mem_address2, mem_address3) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [userid, userpw, name, hp, email, hobby, ssn1, ssn2, zipcode, address1, address2, address3], (err, result) => {
                conn.release();
                if(err){
                    callback(err, null);
                    return;
                }else{
                    console.log("가입완료!");
                    callback(null, result);
                }
            });
        }
    });
}


const loginMember = function(userid, userpw, callback){
    pool.getConnection((err, conn) => {
        if(err){
            console.log(err);
            return;
        }else{
            const sql = conn.query('select mem_idx, mem_userid, mem_name from tb_member where mem_userid=? and mem_userpw=?', [userid, userpw], (err, result) => {
                conn.release();
                if(err){
                    callback(err, null);
                    return;
                }else{
                    if(result.length > 0){
                        console.log('일치하는 사용자가 있음');
                        callback(null, result);
                    }else{
                        console.log('일치하는 사용자가 없음');
                        callback(null, null);
                    }
                    return;
                }
            });
        }
    });
}


// 정보 수정


// 정보 삭제


app.use("/", router);



app.listen(3000, () => {
    console.log('3000번 포트로 서버 동작중 ...');
});
