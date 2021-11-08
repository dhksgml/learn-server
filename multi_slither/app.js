const express = require('express');
const path = require('path')
const nunjucks = require('nunjucks');
const morgan = require('morgan');

const webSocket = require('./socket');
const indexRouter = require('./routes/index');

const app = express();
app.set('port', process.env.PORT||8005);
app.set('view engine', 'html');
nunjucks.configure('views',{
    express: app,
    wahch: true
});

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/', indexRouter);

app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) =>{
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

const server = app.listen(app.get('port'), ()=> {
    console.log(app.get('port'), '번 포트에서 대기 중');
});


module.exports = app;
webSocket(server);