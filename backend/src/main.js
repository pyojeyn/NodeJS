import Koa from 'koa';
import mongoose from 'mongoose';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import jwtMiddleware from './lib/jwtMiddleware';

import api from './api';

const app = new Koa();
const router = new Router();
//라우터 설정
router.use('/api',api.routes());

app.use(bodyParser());
app.use(jwtMiddleware);
app.use(router.routes()).use(router.allowedMethods());

const port = 4000;

mongoose
.connect('mongodb://localhost:27017/jcp',{useNewUrlParser: true})
.then(()=>{
    console.log('Connected to MongoDB');
})
.catch(e=>{
    console.error(e);
});
app.listen(port, ()=>{
    console.log(`${port} 로 서버 실행중...`);
});