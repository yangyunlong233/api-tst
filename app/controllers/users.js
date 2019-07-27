// 內存數據庫
const db = [{
    name: "Jason"
}];

class UsersCtl {
    // GET 查所有用戶
    find(ctx) {
        ctx.body = db;
    }

    // GET 查特定用戶
    findById(ctx) {
        ctx.body = db[ctx.params.id * 1];
    }

    // POST 新建用戶
    create(ctx) {
        db.push(ctx.request.body);
        ctx.body = ctx.request.body;
    }

    // PUT 修改用戶
    update(ctx) {
        db[ctx.params.id * 1] = ctx.request.body;
        ctx.body = ctx.request.body;
    }

    // DELETE 刪除用戶
    del(ctx) {
        db.splice(ctx.params.id * 1, 1);
        ctx.status = 204;
    }
}

module.exports = new UsersCtl();