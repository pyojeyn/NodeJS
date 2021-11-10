
// 문제 : test.html 파일을 읽어 사용자에게 html 문서를 전달하는 node파일을 작성
const http =require('http');
const fs = require('fs');

http.createServer((req,res) =>{
    fs.readFile('test.html',(err,data) =>{
        if(err){
            console.log(err);
        }else{
            res.writeHead(200, {'content-type':'text/html'});
            res.end(data);
        }
    })
    }).listen(3000, () =>{
        console.log('3000번 포트로 서버 실행중..')
});

/*
 내가 문 답안이랑 강사님꺼랑 비교해보자 
 코드가 많이 다르긴한데 되긴 됨 ㅎ 

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

*/ 