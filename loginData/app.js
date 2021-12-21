const express = require('express');

const { sequelize, User } = require('./model');
const indexRouter = require('./route');
// const usersRouter = require('./route/users');

const app = express();
app.set('port', process.env.PORT||3000);

sequelize.sync({ force: false })
    .then(() => {
        console.log("DB 연결 성공");
    })
    .catch((err) => {
        console.error(err);
    });


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/',indexRouter);
// app.use('/users',usersRouter);

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});