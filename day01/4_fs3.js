const fs = require('fs');

//동기식으로 읽음, 동기식은 예외처리를 별도로 해야함
try{
    const text1 = fs.readFileSync('text11111.txt','utf-8');
    console.log(`동기식으로 읽음 ${text1}`) 
}catch(e){
    console.log(e);
}

console.log('프로그램을 종료합니다.');

