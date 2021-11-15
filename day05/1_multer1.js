const express = require('express');
const bodyParser = require('body-parser');
const static = require('serve-static');
const multer = require('multer');
const path = require('path');
const logger = require('morgan');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({extended:false}));
//127.0.0.1/public/index.html -> router를 따로 만들지 않아도 직접접근할수 있다.
app.use('/public', static(path.join(__dirname, "public"))); 
app.use('/uploads', static(path.join(__dirname, 'uploads')));
app.use(logger('dev'));

const storage = multer.diskStorage({
    destination:(res, file, callback) => {  //사용자로부터 데이터 받으면 res, 파일이 날라오면 file, 그 결과 어쩌고저쩌고 콜백에 담아서 보냄
        callback(null,'uploads');  //uploads란 폴더에 디스크 저장 , null항목은 에러쪽이다 에러 안났다는 뜻. 
    },
    filename: (req,file, callback) =>{
        const extension = path.extname(file.originalname);  //extname :전달한파일의 이름(확장명) apple.png  extention에 png만 들어가게 될것임
        const basename = path.basename(file.originalname, extension); // extention을 때내고 basename 만 남겨라 apple만 남게 됨
        callback(null, basename+"_"+Date.now()+extension); //apple_345346.png -> 절때 겹칠일이 없음
        }
});


const upload = multer({
    storage: storage,
    limit:{
        files:1,
        filsSize:1024 * 1024 * 100 
    }
});


router.route('/write').post(upload.array('photo',1),(req,res) =>{
    try{
        const files = req.files;
        console.log(req.files[0]);

        let originalname = '';
        let filename = '';
        let mimetype = '';
        let size = 0;

        if(Array.isArray(files)){
            console.log(`클라이언트에서 받아온 파일 개수 : ${files.length}`);

            for(let i=0; i<files.length; i++){
                originalname = files[i].originalname;
                filename = files[i].filename;
                mimetype = files[i].mimetype;
                size = files[i].size;
            }
        }

        const title = req.body.title;

        res.writeHead('200', {'content-type':'text/html;charset=utf8'}); //여기서 = 를 : 로써서 한글 깨졌음
        res.write('<h2>이미지업로드성공</h2>');
        res.write('<hr/>');
        res.write(`<p>제목 : ${title}</p>`);
        res.write(`<p>원본파일명 : ${originalname}</p>`);
        res.write(`<p>현재파일명 : ${filename}</p>`);
        res.write(`<p>MimeType : ${mimetype}</p>`);
        res.write(`<p>파일크기 : ${size}</p>`);
        res.write(`<p><img src='/uploads/${filename}' width=200></p>`); //여기서 따옴표 위치 잘못해서 이미지 엑박이었음;
        res.end();
    }catch(e){
        console.log(e);
    }
});




app.use('/', router); 

app.listen(3000,()=>{
    console.log('3000번 포트로 서버 동작중...')
})