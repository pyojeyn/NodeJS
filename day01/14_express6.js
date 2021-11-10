const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:false})); //body-parser 미들웨어 등록

const router = express.Router(); //Router 객체 생성 ! 

//http://127.0.0.1:3000/member/login (post)
router.route('/member/login').post((req, res) =>{
    console.log(`/member/login 호출`)
});

//http://127.0.0.1:3000/member/regist (post)
router.route('/member/regist').post((req, res) =>{
    console.log(`member/regist 호출`)
})

//http://127.0.0.1:3000/member/about (get)
router.route('/member/about').get((req, res) =>{
    console.log(`member/about 호출`)
})





app.use('/', router); // ※ 이거 미들웨어 무조건 등록해줘야 함 ! 
// '/' 로 해주면 안에 있는 하위 항목까지 다 포함해줌 모든 페이지다 나오게 해줌


// 모든 페이는 여기를 다 들려줘 ! 
app.all('*',(req,res) => {
    res.status(404).send('<h2>페이지를 찾을 수 없습니다</h2>'); //404 떳을 때만 send해줘 ! 
})

app.listen(3000, () => {
    console.log('3000번 포트로 서버 실행중...');
});