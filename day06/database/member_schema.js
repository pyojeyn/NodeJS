const { Schema } = require("mongoose");
const crypto = require('crypto');

Schema.createSchema = function(mongoose){
    console.log('createSchema 호출!');
    const StudySchema = mongoose.Schema({
        userid: {type:String, require:true},
        hashed_password : {type:String}, //암호화된 비밀번호 저장
        name :{type:String, default:''},
        salt : {type:String}, //암호화 시킬때 이 값을 넣어서 암호화 넣어라 하는 특별한 key값
        age: {type:Number, default:0},
        create_at: {type:Date, default: Date.now()},
        update_at: {type:Date, default: Date.now()},
        provider: {type:String, default:''}, //카카오 or 페이스북 or 트위터 어떤걸로 회원가입하는지 
        authToken: {type:String, default:''}, //사용자가 가입을하면 해당 회사에서 토큰을 줌 나중에 로그인할때 이 토큰과 비교 
        kakao: {} // 이 사용자에 대한 카카오에서 전달받은 내용을 통채로 json으로 카카오객체에 저장
    });

    //userpw 관련한 가상 프로퍼티 만들거임 여기서 일반 패스워드 받고 위에 hashed_password를 만들거임 
    StudySchema.virtual('userpw')
    .set(function(userpw){
        this._userpw = userpw; // 이름이 겹칠때
        this.salt = this.makeSalt(); //함수에 의해서 데이터를 받아쓸거기 때문에 _ 사용 안함
        this.hashed_password = this.encryptPassword(userpw);
    })
    .get(function(){
        return this._userpw;
    });

    // 문자열 리턴하는 함수 salt 값 
    StudySchema.method('makeSalt', function(){
        console.log('makeSalt 호출');
        return Math.round((new Date().valueOf() * Math.random())) + ''; // 알수 없는 숫자
    });

    StudySchema.method('encryptPassword',function(plainText, inSalt){ //plainText : 일반 비밀번호 ,inSalt: 암호화할때 섞을 Salt값
        if(inSalt){ //회원가입 할때
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        }else{ //로그인 원래 salt 가 있다는 소리 이미 회원가입한거임 
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex'); //원래 들어있는 salt값
        }
    });

    // 내가 입력한값과 이미저장되어있는 값 비교
    StudySchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){ // 회원가입 하고 자동로그인 할때
            return this.encryptPassword(plainText, inSalt) == hashed_password;
        }else{ // 회원가입 이전에 되있고 그냥 로그인 할때
            return this.encryptPassword(plainText) == hashed_password;
        }
    });

    // 비번 안넣었을 때 
    const validatePresenceOf = function(value){
        return value && value.length;
    }

    // save : 저장 이벤트
    // 저장 이벤트 발생하기 전
    StudySchema.pre('save', (next)=>{
        if(!this.isNew) return next(); // MemberSchema의 isNew에 값이 없으면 다음으로 진행
        if(!validatePresenceOf(this.userpw)){ 
            next(new Error('유효하지 않은 비밀번호입니다.'));
        }else{
            next(); // 저장
        }
    });

    console.log('MemberSchema 정의 완료');
    return StudySchema;
}

module.exports = Schema;