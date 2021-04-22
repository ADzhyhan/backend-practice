const Router = require('koa-joi-router');
const passport = require('koa-passport');

const { UsersController } = require('./users.controller');
const UserValidator = require('./users.validator');

const router = new Router();

router.get('/profile', passport.authenticate('jwt', { session: false }), UsersController.profile);
router.get('/refresh/token', UsersController.refresh);
router.post('/', UserValidator.signUp, UsersController.createUser);
router.post('/login', UserValidator.logIn, UsersController.logIn);
router.get('/', passport.authenticate('jwt', { session: false }), UsersController.userList);
// router.post('/example', UserValidator.example, UsersController.example);

module.exports = router; 
