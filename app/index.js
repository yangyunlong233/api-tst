const Koa = require('koa');
const bodyparser = require('koa-bodyparser');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const mongoose = require('mongoose');
const { connectionStr } = require('./config');
const app = new Koa();
const routing = require('./routes');

mongoose.connect(connectionStr, { useNewUrlParser: true }, () => {
    console.log('mongoDB is Connected.')
});
mongoose.connection.on('error', console.error);

// 錯誤處理
app.use(error({
    postFormat: (err, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack, ...rest}
}));

// 路由注册
app.use(bodyparser());

// 參數校驗
app.use(parameter(app));

routing(app);

app.listen(9000, () => console.log('server is running in port 9000'));

