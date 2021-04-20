const passport = require('koa-passport');
const Router = require('koa-router');

const controllers = require('./users.controller');

const router = new Router();

// router.get('user/:userId', controllers.getUser);
router.get('/profile', passport.authenticate('jwt', { session: false }), controllers.profile);
router.get('/refresh/token', controllers.refresh);
router.post('/user', controllers.createUser);
router.post('/login', controllers.logIn);

module.exports = {
  router,
};
