const fs = require('fs');
const data = 'Hello node.js!!';

fs.writeFile('text4.txt', data, (err) => {
    if(err){
        console.log('에러 발생')
    }else{
        console.log('비동기식으로 파일저장!')
    }
});

fs.writeFileSync('text5.txt', data, 'utf-8');
console.log('동기식으로 파일저장')

//==================================================================
// fs.writeFile('파일명', '파일에 뭐라고 쓸건지 저장한 변수(data)', (에러발생여부)) -> 읽어들이는게 없기때문에 에러날 확률밖에 없어, 에러가 나던지 안나던지.
// fs.writeFileSync('파일명','파일에 뭐라고 쓸건지 저장한 변수(data)', '인코딩방식')

