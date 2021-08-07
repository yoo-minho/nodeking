const express = require('express');
const app = express();
const port = 3000;

const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const fs = require('fs');

const topicRouter = require('./routes/topic');
const indexRouter = require('./routes/index');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));
//app.use(helmet());
app.use(compression());

app.get('*', function (request, response, next) {
    fs.readdir('./data', function (error, filelist) {
        request.list = filelist;
        next();
    });
})

app.use('/', indexRouter);
app.use('/topic', topicRouter);

app.use((req, res) => {
    res.status(404).send("404-sorry");
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("500-sorry");
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
