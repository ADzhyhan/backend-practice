const Koa = require('koa');
const path = require('path');
const Router = require('koa-router');
const views = require('koa-views');
// const Redis = require('ioredis');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const nunjucks = require('nunjucks');

const globalRouter = require('./src/router');
const passport = require('./src/libs/passport/koaPassport');

passport.initialize();

const app = new Koa();

const nunjucksEnvironment = new nunjucks.Environment(
  new nunjucks.FileSystemLoader(path.join(__dirname, '/src/templates')),
);

app.use(bodyParser());
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.isJoi) {
      ctx.throw(400, err.details[0].message);
    }

    if (err.isPassport) {
      ctx.throw(400, err.message);
    }

    ctx.throw(err.status || 500, err.message);
  }
});

const router = new Router();

const port = process.env.PORT || 3000;

const render = views(path.join(__dirname, '/src/templates'), {
  extension: 'html',
  options: {
    nunjucksEnv: nunjucksEnvironment,
  },
  map: {
    html: 'nunjucks',
  },
});

app.use(render);
app.use(serve(path.join(__dirname, '/src/public')));
router.use('/', globalRouter.router.routes());

app.use(router.routes());

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// const Koa = require('koa');
// const path = require('path');
// const Router = require('koa-router');
// const Redis = require('ioredis');
// const views = require('koa-views');
// const serve = require('koa-static');
// const cors = require('@koa/cors');

// const globalRouter = require('./src/router');

// const app = new Koa();

// app.use(cors());

// const redis = new Redis('redis://localhost:6379');

// app.context.redis = redis;

//
// app.use(async (ctx, next) => {
//   try {
//     await next();
//   } catch (err) {
//     if (err.isJoi) {
//       ctx.throw(400, err.details[0].message);
//     }
//     console.log(err);
//     ctx.throw(400, 'Something wrong');
//   }
// });

// const router = new Router();

// const port = process.env.PORT || 3001;

// const render = views(path.join(__dirname, '/src/templates'), {
//   extension: 'njk',
//   map: {
//     njk: 'nunjucks',
//   },
// });

// app.use(render);
// app.use(serve(path.join(__dirname, '/src/public')));

// router.use('/', globalRouter.router.routes());

// app.use(router.routes());

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
