const express = require('express');
const router = express.Router();

const template = require('../lib/template.js');
const auth = require('../lib/auth');

router.get('/', (request, response) => {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}<img width="300px" src=/images/bg.jpg>`,
        `<a href="/topic/create">create</a>`,
        auth.statusUI(request),
    );
    response.writeHead(200);
    response.end(html);
});

module.exports = router;