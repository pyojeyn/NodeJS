const express = require('express'); //express 모듈 가져다 쓸거임
const app = express(); //express 객체 생성할거임

app.get('/' ,(req,res) =>{
    console.log('첫번째 페이지 실행');
    res.redirect('https://www.naver.com');  //redirect() : 웹 페이지의 경로를 강제로 이동
});

app.listen(3000, () => {
    console.log('3000번 포트로 서버 실행중...');
});

