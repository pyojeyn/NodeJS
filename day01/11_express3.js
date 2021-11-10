//헤더값도 받아오고 거기에 딸린 get방식을 전달하면 받아오기

const express = require('express');
const app = express();

//get 방식으로 데이터 보내기 ~!
//http://127.0.0.1:3000/?userid=apple&userpw=1111
app.get('/', (req,res) => {
    console.dir(req.header); //사용자가 보내준 정보를 담고 있는 프로퍼티 dir하면 객체 안을 볼수 있음 
    const userAgent = req.header('User-Agent'); //header에 User-Agent라는 항목이 따로 있음;
    //Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36
    console.log(userAgent);

    //get 요청 매개변수 받기
    const userid = req.query.userid;
    const userpw = req.query.userpw;

    console.log(`userid = ${userid}`);
    console.log(`userpw = ${userpw}`);

    // 서버에서 사용자쪽에서 화면을 보여줄거니까 응답 ! response가지고 처리
    res.writeHead(200,{'content-type' :'text/html ; charset=utf-8'});
    res.write(`<h2>익스프레스 서버에서 응답한 메세지 입니다. </h2>`);
    res.write(`<p>user-agent :${userAgent}</p>`);
    res.write(`<p>userid :${userid}</p>`);
    res.write(`<p>userpw :${userpw}</p>`);
});

app.listen(3000, () => {
    console.log('3000번 포트로 서버 실행중...');
});
