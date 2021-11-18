import Router from 'koa-router';
import checkLoggedIn from '../../lib/checkLoggedIn';
import * as postsCtrl from './posts.ctrl';
const posts = new Router();

posts.post('/',checkLoggedIn,postsCtrl.write);

posts.get('/', postsCtrl.list);

const post = new Router();
// api/post/id
post.get('/', postsCtrl.read);

// 로그인되어있나 체크, 자기가 쓴 글 맞는지 체크
post.delete('/',checkLoggedIn,postsCtrl.checkOwnPost, postsCtrl.remove);
//수정
post.patch('/',checkLoggedIn,postsCtrl.checkOwnPost, postsCtrl.update);




// posts 라우터 에다 post이름으로 등록한 라우터 등록하기!!
posts.use('/:id',postsCtrl.getPostById,post.routes());
export default posts;



