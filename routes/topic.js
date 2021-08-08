const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');
const auth = require('../lib/auth');

router.get('/create', (request, response) => {
    if (!auth.isOwner(request)) return response.redirect('/');
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
          <form action="/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
              <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
              <input type="submit">
            </p>
          </form>
        `, '', auth.statusUI(request),);
    response.writeHead(200);
    response.end(html);
});

router.get('/:pageId', (request, response, next) => {
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        if (err) return next(err);
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {allowedTags: ['h1']});
        var list = template.list(request.list);
        var html = template.HTML(sanitizedTitle, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            ` <a href="/topic/create">create</a>
                <a href="/topic/update/${sanitizedTitle}">update</a>
                <form action="/topic/delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`,
            auth.statusUI(request),
        );
        response.writeHead(200);
        response.end(html);
    });
});

router.post('/create_process', (request, response) => {
    if (!auth.isOwner(request)) return response.redirect('/');
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.redirect(`/topic/${title}`);
    })
});

router.get('/update/:pageId', (request, response) => {
    if (!auth.isOwner(request)) return response.redirect('/');
    var filteredId = path.parse(request.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = request.params.pageId;
        var list = template.list(request.list);
        var html = template.HTML(title, list,
            `
            <form action="/topic/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${sanitizeHtml(description, {allowedTags: ['h1']})}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`,
            auth.statusUI(request),
        );
        response.writeHead(200);
        response.end(html);
    });
});

router.post('/update_process', (request, response) => {
    if (!auth.isOwner(request)) return response.redirect('/');
    var post = request.body;
    var id = post.id;
    var title = post.title;
    var description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
            response.redirect(`/topic/${title}`);
        })
    });
});

router.post('/delete_process', (request, response) => {
    if (!auth.isOwner(request)) return response.redirect('/');
    var post = request.body;
    var id = post.id;
    var filteredId = path.parse(id).base;
    fs.unlink(`data/${filteredId}`, function (error) {
        response.redirect("/");
    })
});

module.exports = router;