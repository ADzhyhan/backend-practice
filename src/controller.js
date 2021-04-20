const crypto = require('crypto');
const passport = require('koa-passport');
const dotenv = require('dotenv');
const jwt = require('jwt-simple');
const db = require('./db/db');
const validator = require('./validator');

const { UserDB } = require('./models/user/UserDB');

dotenv.config();

const controllerPages = {
  async index(ctx) {
    await ctx.render('index');
  },

  async signin(ctx) {
    await ctx.render('./signin/sign-in');
  },

  async password_recovery(ctx) {
    await ctx.render('./signin/pass-recovery');
  },

  async ready(ctx) {
    await ctx.render('./signin/rec-ready');
  },

  async reset_password(ctx) {
    await ctx.render('./signin/reset-pass');
  },

  async signup(ctx) {
    await ctx.render('./signup/signUp-1');
  },

  async signup2(ctx) {
    await ctx.render('./signup/signUp-2');
  },

  async signup_ready(ctx) {
    await ctx.render('./signup/signup-ready');
  },

  async profile_info(ctx) {
    await ctx.render('./profile/profile-personal');
  },

  async profile_account(ctx) {
    await ctx.render('./profile/profile-account');
  },

  async search_results(ctx) {
    await ctx.render('./search/search-results');
  },

  async search_map(ctx) {
    await ctx.render('./search/search-map');
  },

  async admin(ctx) {
    await ctx.render('./admin/admin');
  },

};

async function profile(ctx) {
  // const { userId } = ctx.request.params;
  // const userResponse = await db.query(`SELECT * FROM "user" WHERE id = ${userId}`);
  // if (!userResponse.rowCount) {
  //   ctx.throw(400, 'User doesn`t exist');
  // }
  // const name = userResponse.rows[0].fname;

  // await ctx.render('index', { name });
  ctx.body = {
    success: true,
  };
}

async function createUser(ctx) {
  const { body } = ctx.request;

  await validator.userSchema.validateAsync(body);

  body.password = crypto.pbkdf2Sync(body.password, 'salt', 100000, 64, 'sha256').toString('hex');

  const createUserResponse = await db.query(`INSERT INTO  "user" (fname, lname, active, password, email) VALUES ('${body.fname}', '${body.lname}', ${body.active}, '${body.password}', '${body.email}') RETURNING *`);

  const user = { ...createUserResponse.rows[0] };

  ctx.status = 201;
  ctx.body = {
    id: user.id,
    fname: user.fname,
    lname: user.lname,
    email: user.email,
  };
}

async function logIn(ctx) {
  await passport.authenticate('local', (err, user) => {
    if (user) {
      ctx.body = user;
    } else {
      ctx.status = 400;
      if (err) {
        ctx.body = { error: err };
      }
    }
  })(ctx);
}

async function refresh(ctx) {
  const token = ctx.headers.authorization.split(' ')[1];
  const decodedToken = jwt.decode(token, process.env.refreshTokenKey);

  if (decodedToken.expiresIn <= new Date().getTime()) {
    const error = new Error('Refresh token expired, please sign in into your account.');
    error.status = 400;

    throw error;
  }

  const user = await UserDB.getUserByEmail(decodedToken.email);

  const accessToken = {
    id: user.id,
    expiresIn: new Date().setTime(new Date().getTime() + 200000),
  };
  const refreshToken = {
    email: user.email,
    expiresIn: new Date().setTime(new Date().getTime() + 1000000),
  };

  ctx.body = {
    accessToken: jwt.encode(accessToken, process.env.secretKey),
    accessTokenExpirationDate: accessToken.expiresIn,
    refreshToken: jwt.encode(refreshToken, process.env.refreshTokenKey),
    refreshTokenExpirationDate: refreshToken.expiresIn,
  };
}

module.exports = {
  controllerPages,
  createUser,
  profile,
  logIn,
  refresh,
};
