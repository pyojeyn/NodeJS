// 로직?

/**
 * POST /api/auth/register
 * {
 *      username:'apple',
 *      passwort:'1111'
 * }
 * 
 */

 import User from '../../models/user';
 import Joi from 'joi'; 
 export  const register = async (ctx) =>{ //ctx : express의 req,res 객체!
     const schema = Joi.object().keys({ //Joi 의 객체의 keys들을 확인
         username: Joi.string().alphanum().min(3).max(20).required(),
         password: Joi.string().required(),
     });
 
     const result = schema.validate(ctx.request.body); // 문법검사
     if(result.error){ //Joi에서 통과하지 못했을때 에러!
         ctx.status = 400;
         ctx.body = result.error;
         return;
     }
 
     const { username, password } = ctx.request.body; 
 
     try{ //지금 전달받은 username이(ctx.request.body) 혹시 잇냐 User 객체에!
         const exists = await User.findByUsername(username);
         if(exists){ // 중복아이디 있으니까 그냥 return 시켜버림 
             ctx.status = 409;
             return;
         }
         // 중복 아이디 없다면 새로운 User 객체 만들어냄
         const user = new User({
             username,
         });
         await user.setPassword(password); // 암호화된 password가 만들어져서 저장
         await user.save(); //model 저장
 
         ctx.body = user.serialize(); //password 뺀 객체 만들어서 body에 저장
 
         const token = user.generateToken(); //토큰 만들어줌
         ctx.cookies.set('access_token',token, { // 쿠키 만들어줌 위에 있는 token 심어줌
             maxAge: 1000 * 60 * 60 *24 * 7, //7일
             httpOnly:true, //브라우저url을 통해서만 쿠키를 확인할수 잇게끔! (해킹방지)
         });
     }catch(e){
         ctx.throw(500,e);
     }
 }
 
 //ctx.request.body : 사용자로부터 전달받은 data

/*
 POST /api/auth/login
 {
     username: 'blue',
     password: '1111'
 }
*/

export const login = async(ctx) => {
    const {username,password} = ctx.request.body;
    
    // 아이디 비번 둘중에 하나 안쳤을때 ?
    if(!username || !password) {
        ctx.status = 401;
        return;
    }

    try{
        const user = await User.findByUsername(username);
        if(!user){ // username의 아이디 사용자가 없을 때 
            ctx.status = 401;
            return;
        }
        // 사용자 잇으면 비번 체크하기
        const valid = await user.checkPassword(password);
        if(!valid){ // 비번 틀렷을 때
            ctx.status = 401;
            return;
        }

        // 비번 맞으면 직렬화 시켜줌
        ctx.body = user.serialize();
        // 토큰 만들어줌
        const token = user.generateToken();
        //쿠키 생성
        ctx.cookies.set('access_token',token,{
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly:true, // 자바스크립트 해킹 방지!
        });
    }catch(e){
        ctx.throw(500,e);
    }

}

/*
 GET /api/auth/check 
 로그인 중인지 아닌지를 체크하는거!
*/

export const check = async (ctx) => {
    const {user} = ctx.state; // ctx의 state를 확인해서user 객체 있는지
    if(!user){
        ctx.status= 401;
        return;
    }
    ctx.body = user;
}

/*
    POST /api/auth/logout
*/

export const logout = async (ctx) => {
    ctx.cookies.set('access_token'); // 쿠키값 삭제 덮어써서 데이터 없애줌
    ctx.status = 204;
};