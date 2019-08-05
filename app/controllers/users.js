// 內存數據庫
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/users');
const { secret } = require('../config');

class UsersCtl {
    // GET 查所有用戶
    async find(ctx) {
        ctx.body = await User.find();
    }

    // GET 查特定用戶
    async findById(ctx) {
        const {fields} = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => '+' + f);
        const user = await User.findById(ctx.params.id).select(selectFields);
        if(!user) {ctx.throw(404, '用戶不存在');}
        ctx.body = user;
    }

    // POST 新建用戶
    async create(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password: {type: 'string', required: true}
        });
        const { name } = ctx.request.body;
        const repeatedUser = await User.findOne({ name });
        if (repeatedUser) {
            ctx.throw(409, '用戶已經存在')
        }
        const user = await new User(ctx.request.body).save();
        ctx.body = user;
    }

    // 授权中间件
    async checkOwner(ctx, next) {
        if (ctx.params.id !== ctx.state.user._id) {
            ctx.throw(403, '没有权限');
        }
        await next();
    }

    // PATCH 修改用戶
    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            password: {type: 'string', required: false},
            avatar_url: {type: 'string', required: false},
            gender: {type: 'string', required: false},
            headline: {type: 'string', required: false},
            locations: {type: 'array', itemType: 'string', required: false},
            business: {type: 'string', required: false},
            employments: {type: 'array', itemType: 'object', required: false},
            educations: {type: 'array', itemType: 'object', required: false},
        });
        const user = await User.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        if(!user) {ctx.throw(404)}
        ctx.body = user;
    }

    // DELETE 刪除用戶
    async del(ctx) {
        const user = await User.findByIdAndRemove(ctx.params.id);
        if(!user) {ctx.throw(404)}
        ctx.status = 204;
    }

    //  login 登錄
    async login(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: true},
            password: {type: 'string', reuired: true},
        });
        const user = await User.findOne(ctx.request.body);
        if (!user) { ctx.throw(401, '用戶名或密碼不正確')}
        const { _id, name } = user;
        const token = jsonwebtoken.sign({_id, name}, secret, {expiresIn: '1d'});
        ctx.body = {token};
    }
}

module.exports = new UsersCtl();