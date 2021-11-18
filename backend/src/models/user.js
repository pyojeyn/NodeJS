import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const UserSchema = new Schema({
    username:String,
    hashedPassword:String,
});
//                                              ↓ 일반 password
UserSchema.methods.setPassword = async function(password) {
    const hash = await bcrypt.hash(password, 10); //hashcode 발생, 일반 password 넣고 10번 salt 돌려서 암호화함
    this.hashedPassword = hash;
//  ↑ UserSchema 객체의 hashedPassword    
};

UserSchema.methods.checkPassword = async function(password) {
    const result = await bcrypt.compare(password, this.hashedPassword); // 일반 password와 기존 hashedPassword와 비교
    return result; //같으면 true, 틀리면 false 
};

// 사용자쪽으로 data를 json으로 전달 회원정보수정,보기 
// password까지 돌려주긴 좀 그러니까 data에서 password를 지워줄거임.
UserSchema.methods.serialize = function() {
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
};

UserSchema.methods.generateToken = function(){
    const token = jwt.sign( //서명
        {_id:this.id, //1. 토큰 안에 적어줄 내용
        username:this.username,},
        '!@#$%^&*()', // 암호화시킬 암호 
        {
            expiresIn:'7d', //이 토큰은 7일동안 유효하다.
        },
    );
    return token;
};

// findeByUsername 은 내가 만든거
UserSchema.statics.findByUsername = function(username){
    return this.findOne({username}); //지정되어잇는 함수 findOne
};

const User = mongoose.model('User',UserSchema);

export default User;