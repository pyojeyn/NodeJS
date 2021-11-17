const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const static = require('serve-static');
const path = require('path');
const expressErrorHandler = require('express-error-handler');
const passport = require('passport');

const app = express();
const router = express.Router();

app.use(cookieParser());
app.use(expressSession({
    secret: '!@#$%^&*()',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }
}));

app.use(logger('dev'));
app.use(passport.initialize());
app.use(passport.session());    // passport의 세션을 사용하려면 반드시 express의 세션 코드가 먼저 설정
app.use(bodyParser.urlencoded({extended:false}));
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/', router);

const errorHandler = expressErrorHandler({
    static: {
        '404':'./public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const config = require('./config/config');
const database = require('./database/database');

// passport 설정
const configPassport = require('./config/passport');
configPassport(app, passport);

// route 설정
const userPassport = require('./routes/route_member');
userPassport(router, passport);




app.listen(config.server_port, () => {
    console.log(`${config.server_port}번 포트로 서버 실행중 ...`);
    database.init(app, config);
});







