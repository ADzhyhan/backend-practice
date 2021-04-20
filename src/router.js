const passport = require('koa-passport');
const Router = require('koa-router');

const controllers = require('./controller');

const router = new Router();

router.get('/', controllers.controllerPages.index);
router.get('sign-in', controllers.controllerPages.signin);
router.get('password-recovery', controllers.controllerPages.password_recovery);
router.get('ready', controllers.controllerPages.ready);
router.get('reset-password', controllers.controllerPages.reset_password);
router.get('sign-up', controllers.controllerPages.signup);
router.get('sign-up2', controllers.controllerPages.signup2);
router.get('sign-up_ready', controllers.controllerPages.signup_ready);
router.get('profile-info', controllers.controllerPages.profile_info);
router.get('profile-account', controllers.controllerPages.profile_account);
router.get('search-results', controllers.controllerPages.search_results);
router.get('search-map', controllers.controllerPages.search_map);
router.get('admin', controllers.controllerPages.admin);

// router.get('user/:userId', controllers.getUser);
router.get('profile', passport.authenticate('jwt', { session: false }), controllers.profile);
router.get('refresh/token', controllers.refresh);
router.post('user', controllers.createUser);
router.post('login', controllers.logIn);

module.exports = {
  router,
};
