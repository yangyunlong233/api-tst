const Router = require('koa-router');
const router = new Router({prefix: '/users'});
const { find, findById, create, update, del } = require('../controllers/users');



// GET 查所有用戶
router.get('/', find);

// GET 查特定用戶
router.get('/:id', findById);

// POST 新建用戶
router.post('/', create);

// PUT 修改用戶
router.put('/:id', update);

// DELETE 刪除用戶
router.delete('/:id', del);

module.exports = router;