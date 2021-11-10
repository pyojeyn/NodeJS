const express = require('express'); //http 안쓰고 express!!
const app = express(); //외부모듈이기때문에 객체를 생성해줘야함 

app.get('/', (req,res) => { //http와 다르게 url 지정해줌
    res.send('익스프레스 서버 테스트'); // http의 end 메소드와 같음
}).listen(3000, () => {
    console.log('3000번 포트로 서버 실행중 ...');
});