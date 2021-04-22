const passport = require('koa-passport');
const jwt = require('jwt-simple'); 
const dotenv = require('dotenv'); 

dotenv.config();

const { UserDB } = require('./models/UserDB');

class UsersController {
  static async example(ctx) {
    const { body } = ctx.request;
    ctx.body = { body };
  }

  static async logIn(ctx, next) {
    await passport.authenticate('local', (err, user) => {
      if (user) {
        ctx.body = user;
      } else {
        ctx.status = 400;
        if (err) {
          ctx.body = { error: err };
        }
      }
    })(ctx, next);
  }

  static async profile(ctx) {
    ctx.body = {
      user: ctx.state.user,
    };
  }

  static async createUser(ctx) {
    const {
      fname, lname, password, email, active,
    } = ctx.request.body;

    ctx.status = 201;
    ctx.body = (await UserDB.createUser(fname, lname, active, password, email)).getInfo();
  }

  static async refresh(ctx) {
    const token = ctx.headers.authorization.split(' ')[1];
    const decodedToken = jwt.decode(token, process.env.refreshTokenKey);

    if (decodedToken.expiresIn <= new Date().getTime()) {
      const error = new Error('Refresh token expired, please sign in into your account.');
      error.status = 400;

      throw error;
    }

    const user = await UserDB.getUserByEmail(decodedToken.email);

    const accessToken = {
      id: user.getId(),
      expiresIn: new Date().setTime(new Date().getTime() + 2000000),
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

  static async userList(ctx) {
    const users = (await UserDB.userList()).map((user) => user.getInfo());

    ctx.body = {
      users,
    };
  }
}

module.exports = { UsersController }; 
