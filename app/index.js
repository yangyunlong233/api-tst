const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const app = new Koa();
const routing = require('./routes');



// 路由注册
app.use(bodyparser());

routing(app);

app.listen(9000, () => console.log('server is running in port 9000'));

