const LocalStrategy = require('passport-local').Strategy;

module.exports = new LocalStrategy({
    usernameField: 'userid',
    passwordField: 'userpw',
    passReqToCallback: true
}, (req, userid, userpw, done) => {
    console.log(`passport의 local-login 호출 : userid:${userid}, userpw:${userpw}`);
    let database = req.app.get('database');
    database.StudyModel.findOne({userid:userid}, (err, user) => {
        if(err){
            return done(err);
        }
        if(!user){
            console.log('아이디를 찾을 수 없음');
            return done(null, false);
        }
        let authenticate = user.authenticate(userpw, user.salt, user.hashed_password);
        if(!authenticate){
            console.log('비밀번호가 일치하지 않음');
            return done(null, false);
        }
        return done(null, user);
    });
});