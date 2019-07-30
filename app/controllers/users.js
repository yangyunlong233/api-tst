// 內存數據庫
const User = require('../models/users')

class UsersCtl {
    // GET 查所有用戶
    async find(ctx) {
        ctx.body = await User.find();
    }

    // GET 查特定用戶
    async findById(ctx) {
        const user = await User.findById(ctx.params.id);
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

    // PATCH 修改用戶
    async update(ctx) {
        ctx.verifyParams({
            name: {type: 'string', required: false},
            password: {type: 'string', required: false}
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
}

module.exports = new UsersCtl();