import jwt from 'jsonwebtoken';
import User from '../models/user';

// ctx 객체와 , next 콜백 (다음 미들웨어로 넘어감)
const jwtMiddleware = async(ctx,next)=>{
    const token = ctx.cookies.get('access_token');
    if(!token) return next(); // access_token 란 token 없으면 다음 미들웨어로 넘어가
    try{
        const decoded = jwt.verify(token,'!@#$%^&*()'); // token 과 내가 만든 암호를 넣어서 그 토큰이 유효한지 알아냄
        ctx.state.user = {
            _id:decoded._id, // 토큰값
            username: decoded.username,
        };
        const now = Math.floor(Date.now() / 1000);
        if(decoded.exp - now < 60 * 60 *24 *3.5){ // 남은 시간이 3.5일보다 적다면
            const user = await User.findById(decoded._id);
            const token = user.generateToken();
            ctx.cookies.set('access_token',token,{
                maxAge: 1000 * 60 * 60 * 24 * 7,
                httpOnly: true,
            });
        }

        return next();
    }catch(e){
        //토큰 검증 실패
        return next();
    }
}

export default jwtMiddleware;