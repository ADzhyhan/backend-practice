const passport = require('koa-passport');
const Router = require('koa-router');

const { UsersController } = require('./users.controller');

const router = new Router();

// router.get('user/:userId', controllers.getUser);
router.get('/profile', passport.authenticate('jwt', { session: false }), UsersController.profile);
router.get('/refresh/token', UsersController.refresh);
router.post('/user', UsersController.createUser);
router.post('/login', UsersController.logIn);

module.exports = {
  router,
};
