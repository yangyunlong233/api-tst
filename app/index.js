const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const mongoose = require('mongoose');
const { connectionStr } = require('./config');
const path = require('path');
const app = new Koa();
const routing = require('./routes');

mongoose.connect(connectionStr, {
    useNewUrlParser: true
}, () => {
    console.log('mongoDB is Connected.')
});
mongoose.connection.on('error', console.error);

// 靜態資源處理
app.use(koaStatic(path.join(__dirname, '/public')));



// 錯誤處理
app.use(error({
    postFormat: (err, {
        stack,
        ...rest
    }) => process.env.NODE_ENV === 'production' ? rest : {
        stack,
        ...rest
    }
}));

// koa body處理
app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, '/public/uploads'),
        keepExtensions: true,
    }
}));

// 參數校驗
app.use(parameter(app));

routing(app);

app.listen(9000, () => console.log('server is running in port 9000'));