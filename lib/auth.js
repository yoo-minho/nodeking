const isOwner = (req) => (!!req.user);
const statusUI = (req) => (isOwner(req) ?
    `${req.user.nickname} | <a href="/auth/logout">logout</a>` :
    `<a href="/auth/login">login</a>`);

module.exports = {
    isOwner: isOwner,
    statusUI: statusUI,
};