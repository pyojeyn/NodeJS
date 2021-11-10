//http 모듈을 가져다 쓰겠다.
const http = require('http');

//                ↓나 자신
const hostname = '127.0.0.1';

//↓ 포트로 사용될거 저장. 
const port = 3000; 

//서버를 생성 server가 서버역할을 할거임;  ※req,res 이름은 마음대로 할수 있으나 순서 바뀌면 안됨
const server = http.createServer((req, res) => { //매개변수 1 : req 사용자에게 전달받을 내용 / 매개변수2 : res 내가 사용자에게 전달할 객체 만든거(서버 -> 사용자)
  res.statusCode = 200; // 요객체를 만들면 사용자에게 너 "나한테 요정한게 페이지가 정상적으로 호출됬어"라고하면서 정상적인 호출임을 알려줌 
  res.setHeader('Content-Type', 'text/plain'); // 서버가 브라우저에게 전달할건데 head를 구성 text/plain : html 아니고 일반 문자임! 글자보내는거임
  res.end('Hello World'); //사용자에게 전달할 내용 'Hello World' 가 문자열 취급 당하면서 전달됨
});

//자바 소켓때 ... 뭐 배웠던거랑 비슷하다던데.. 노기억임 ㅎ 쨋든 서버 돌리고 브라우저 띄울라면 이거 꼭해야하는듯;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});