import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';
import sanitizeHtml from 'sanitize-html'; 

const { ObjectId } = mongoose.Types;

const sanitizeOption = { //어떤 태그와 속성과 스키마만 허용할건지 객체로 만들어 놓음;
    allowedTags : ['h1', 'h2', 'b','i','u','s','p','ul','ol','li','blockquote','a','img'],
    allowedAttributes: {
        a: ['href', 'name', 'target'],
        img: ['src'],
        li: ['class'],
    },
    allowedSchemes: ['data', 'http']
};

/*
POST /api/posts

{
    title:'제목',
    body: '내용',
    tags: ['태그1','태그2']
}
*/

export const write = async (ctx) => { //제약조건! 
    const schema = Joi.object().keys({ 
        title: Joi.string().required(), //문자열 not null
        body: Joi.string().required(),
        tags: Joi.array().items(Joi.string()).required() //배열이어야하고 문자열로 무조건 넣어야함
    });

    const result = schema.validate(ctx.request.body); //문법검사 해서 안맞으면 에러 400번으로 처리
    if(result.error) {
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    const { title, body, tags } = ctx.request.body;
    const post = new Post({
        title,
        body: sanitizeHtml(body, sanitizeOption), //body의 내용을 sanitizeOption로 체크
        tags,
        user: ctx.state.user, //로그인 되어있는 사용자 정보
    });
    try{
        await post.save(); //몽고디비 저장
        ctx.body = post;
    }catch (e) {
        ctx.throw(500, e);
    }
};

/*
    GET /api/posts?username=blue&tag=['안녕','방가']&page=1
*/

export const list = async (ctx) => {
    const page = parseInt(ctx.query.page || '1',10); // 10 진수
    //매개변수 page 가 있으면 ctx.query.page 없으면 '1'

    if(page < 1){
        ctx.status =400;
        return;
    }

    const {tag,username}=ctx.query;
    const query = {
        ...(username ? {'user.username' : username} : {}),
        ...(tag ? {tags:tag}:{}),
    };

    try{
        const posts = await Post.find(query)
        .sort({_id:-1}) // 내림차순! 최신글이 제일 위에
        .limit(10) // 열개씩
        .skip((page -1) * 10) //페이징
        .lean()
        .exec();
        const postCount = await Post.countDocuments(query).exec;
        ctx.set('Last-Page',Math.ceil(postCount/10)); // 마지막 페이지 
        ctx.body =posts.map((post) =>({
            ...post,
            body:removeHtmlAndShorten(post.body),
        }));
    }catch(e){
        ctx.throw(500,e);
    }
};    

// html 을 없애고 내용이 너무 길으면 200자로 제한시키는 함수 
const removeHtmlAndShorten = (body) =>{
    const filtered = sanitizeHtml(body,{
        allowedTags:[], //html 아무것도 허용 안함
    });
    return filtered.length < 200 ? filtered:`${filtered.slice(0,200)}...`;
};

/*
    GET /api/post/:id
*/
export const read = async (ctx) => {
    ctx.body = ctx.state.post;
};

/*
    DELETE /api/post/:id
*/

export const remove = async (ctx) => {
    const { id } = ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        ctx.status = 204;
    }catch(e){
        ctx.throw(500,e);
    }
};

//post.user._id : post 안에 잇는 글쓴이 정보 진짜 글쓴이 
// user.i_id checkOwnPost 의 매개변수로 넘어온 값! 둘이 비교
export const checkOwnPost = (ctx, next) => {
    const {user,post} = ctx.state;
    if(post.user._id.toString() !== user._id){
        ctx.status = 403;
        return;
    }
    return next();
};



export const getPostById = async (ctx,next) => {
    const { id } = ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status = 400;
        return;
    }
    try{
        const post = await Post.findById(id);
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.state.post = post;
        return next();
    }catch(e){
        ctx.throw(500,e);
    }
}

/*
    PATCH /api/posts/:id
    {
        "title": "수정",
        "body": "수정 내용",
        "tags": ["수정","태그"]
    }
*/

export const update = async (ctx) => {
    const {id} = ctx.params; // params로 넘어온 id 값 저장
    const schema = Joi.object().keys({ // 제약걸어줌, 수정해야하는데 다 수정할 필요는 없으니까 required() 제외
        title: Joi.string(),
        body: Joi.string(),
        tags: Joi.array().items(Joi.string()),
    });

    // 위에문법체크 
    const result = schema.validate(ctx.request.body);
    // 문법 틀리면
    if(result.error){
        ctx.status = 400;
        ctx.body = result.error;
        return;
    }

    // 문법 통과하면
    const nextData = { ...ctx.request.body };
    if(nextData.body) { //데이터가 있다면
        nextData.body = sanitizeHtml(nextData.body, sanitizeOption);
    }
    try{
        const post = await Post.findByIdAndUpdate(id,nextData,{
            new:true, //true: update된 데이터를, false: update 전 데이터를 변수에 담음
        }).exec();
        if(!post){
            ctx.status = 404;
            return;
        }
        ctx.body = post;
    }catch(e){
        ctx.throw(500,e);
    }
};