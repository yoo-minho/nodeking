const express = require('express');
const app = express();
const port = 3000;

const session = require('express-session');
const fileStore = require('session-file-store')(session);
const bodyParser = require('body-parser');
const compression = require('compression');
const fs = require('fs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(compression());
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false,
    store: new fileStore(),
    cookie: {
        httpOnly: true,
    }
}))

const passport = require('./lib/passport')(app);

const authRouter = require('./routes/auth')(passport);
const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');

app.get('*', function (request, response, next) {
    fs.readdir('./data', function (error, filelist) {
        request.list = filelist;
        next();
    });
})

app.use('/', indexRouter);
app.use('/topic', topicRouter);
app.use('/auth', authRouter);

app.get('/gstation', (request, response) => {
    if(Number(request.query.price) === 1300){
        setTimeout(() => {
            response.status(200).json(["A001", "A002"])
        }, 1000)
    } else if (Number(request.query.price) === 1400){
        setTimeout(() => {
            response.status(200).json(["A003", "A004"])
        }, 1500)
    } else if (Number(request.query.price) === 1500){
        setTimeout(() => {
            response.status(200).json(["A005", "A006"])
        }, 500)
    } else {
        setTimeout(() => {
            response.status(404).json([])
        }, 1000)
    }
});

app.use((req, res) => {
    res.status(404).send("404-sorry");
});

app.use((err, req, res) => {
    console.error(err);
    res.status(500).send("500-sorry");
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
