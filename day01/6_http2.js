const http = require('http'); //http모듈

// http.createServer((req,res) => {
//     //res.writeHead(res.statusCode, content-type);
//     res.writeHead(200,{'content-type' : 'text/html'}); //헤더부분
//     res.end("<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>html 모듈 
//     테스트 </title></head><body></body></html>");
// }).listen(3000,() => {
//     console.log(`3000번 포트로 서버 실행중`)
// });




// 문제 : test.html 파일을 읽어 사용자에게 html 문서를 전달하는 node파일을 작성
const fs = require('fs');
const test = fs.readFileSync('test.html','utf-8');
console.log(`동기식으로 읽음 ${test}`) 


http.createServer((req,res) => {
    //res.writeHead(res.statusCode, content-type);
    res.writeHead(200,{'content-type' : 'text/html'}); 
    res.end(test);
}).listen(3000,() => {
    console.log(`3000번 포트로 서버 실행중`)
});
