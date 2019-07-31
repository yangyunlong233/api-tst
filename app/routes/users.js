const Router = require('koa-router');
const jsonwebtoken = require('jsonwebtoken');
const router = new Router({prefix: '/users'});
const { find, findById, create, update, del, login, checkOwner } = require('../controllers/users');

const { secret } = require('../config');

const auth = async (ctx, next) => {
    const { authorization = '' } = ctx.request.header;
    const token = authorization.replace('Bearer ', '');
    try {
        const user = jsonwebtoken.verify(token, secret);
        ctx.state.user = user;
    } catch(err) {
        ctx.throw(401, err.message);
    }
    await next();
}


// GET 查所有用戶
router.get('/', find);

// GET 查特定用戶
router.get('/:id', findById);

// POST 新建用戶
router.post('/', create);

// PUT 修改用戶
router.patch('/:id', auth, checkOwner, update);

// DELETE 刪除用戶
router.delete('/:id', auth, checkOwner, del);

// Login 用戶登錄
router.post('/login', login)

module.exports = router;