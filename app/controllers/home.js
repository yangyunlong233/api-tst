class HomeCtl {
    index(ctx) {
        ctx.body = '<h1>Greetings!</h1>';
    }
}

module.exports = new HomeCtl();