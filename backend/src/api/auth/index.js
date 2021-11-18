import Router from 'koa-router';
import * as authCtrl from './auth.ctrl';
//auth.ctrl 에서 export를 각각 따로따로 해줬기 때문에 앞에 * 붙여줘야한다.!!

// 여기에서는 url만 등록 해주고 실질적으로 불려지는 내용은 auth.ctrl.js 에만 만들어 주겠다 
// 여기에서는 껍데기 ! 

const auth = new Router();

// post http://127.0.0.1:4000/api/auth/register
auth.post('/register', authCtrl.register);
// post  http://127.0.0.1:4000/api/auth/login
auth.post('/login',authCtrl.login);
// get  http://127.0.0.1:4000/api/auth/check
auth.get('/check',authCtrl.check);
// post  http://127.0.0.1:4000/api/auth/logout
auth.post('/logout',authCtrl.logout);

export default auth; //여기서 만든 Router를 auth라는 이름으로 써라 ! 