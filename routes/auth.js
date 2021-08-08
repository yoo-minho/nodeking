const express = require('express');
const router = express.Router();

const template = require('../lib/template.js');

module.exports = function (passport) {
    router.get('/login', (request, response) => {
        var title = 'WEB - login';
        var list = template.list(request.list);
        var html = template.HTML(title, list, `
          <div style="color:red;">${request.session.errorMsg}</div>
          <form action="/auth/login_process" method="post">
            <p><input type="text" name="email" placeholder="email"></p>
            <p><input type="password" name="password" placeholder="password"></p>
            <p>
              <input type="submit" value="login">
            </p>
          </form>
        `, '');
        response.writeHead(200);
        response.end(html);
    });

    //로그인은 됨
    router.post('/login_process', passport.authenticate('local'), function (req, res) {
        req.session.save(function () {
            res.redirect("/");
        })
    });

    //커스텀 콜백을 쓰면 로그인 에러 처리는 되는데, 로그인이 안 됨
    /*
    router.post('/login_process', function (req, res, next) {
        passport.authenticate('local', function (err, user, info) {
            console.error(err, user, info);
            if (!user) {
                req.session.errorMsg = info.message;
                req.session.save(function () {
                    res.redirect("/auth/login");
                })
                return;
            }
            req.session.errorMsg = "";
            req.session.save(function () {
                res.redirect("/");
            })
        })(req, res, next)
    });
    */

    router.get('/logout', (request, response) => {
        request.logout();
        request.session.save(function () {
            response.redirect('/');
        });
    });
    return router;
}