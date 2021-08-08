module.exports = function (app) {

    var authData = {
        email: 'dellose@naver.com',
        password: 'dbalsgh101010',
        nickname: '데로즈'
    }

    const passport = require('passport'),
        LocalStrategy = require('passport-local').Strategy;

    app.use(passport.initialize({}));
    app.use(passport.session({}));

    passport.serializeUser((serializeUser, done) => done(null, serializeUser.email));
    passport.deserializeUser((id, done) => done(null, authData));

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordFiled: 'pwd',
    }, function (username, password, done) {
        if (username !== authData.email) return done(null, false, {message: 'Incorrect username.'})
        if (password !== authData.password) return done(null, false, {message: 'Incorrect password.'})
        return done(false, authData);
    }));

    return passport;
}

