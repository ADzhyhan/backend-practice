const Koa = require('koa');
// const path = require('path');
const Router = require('koa-router');
// const views = require('koa-views');
const bodyParser = require('koa-bodyparser');
// const serve = require('koa-static');

const { errorCatcher } = require('./src/middlewares/errorCatcher');
const usersRouter = require('./src/users/users.router');
const passport = require('./src/libs/passport/koaPassport');

passport.initialize();

const app = new Koa();

app.use(bodyParser());
app.use(errorCatcher);

const router = new Router();

const port = process.env.PORT || 3000;

router.use('/users', usersRouter);

app.use(router.middleware());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
