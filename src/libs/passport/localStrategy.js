const LocalStrategy = require('passport-local');
const jwt = require('jwt-simple');
const dotenv = require('dotenv');

dotenv.config();

const { UserDB } = require('../../users/models/UserDB');

const opts = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: true,
};

module.exports = new LocalStrategy(opts, async (req, email, password, done) => {
  UserDB.checkPassword(email, password).then((checkPasswordResponse) => {
    if (!checkPasswordResponse.flag) {
      return done({ message: checkPasswordResponse.message }, false);
    }

    const { user } = checkPasswordResponse;

    const accessTokenPayload = {
      id: user.id,
      expiresIn: new Date().setTime(new Date().getTime() + 200000),
    };
    const refreshTokenPayload = {
      email: user.email,
      expiresIn: new Date().setTime(new Date().getTime() + 1000000),
    };

    const accessToken = jwt.encode(accessTokenPayload, process.env.secretKey);
    const refreshToken = jwt.encode(refreshTokenPayload, process.env.refreshTokenKey);

    user.tokens = { accessToken, refreshToken };
    // user.tokens = {
    //   accessToken: jwt.encode(accessToken, 'super_secret'),
    //   accessTokenExpirationDate: accessToken.expiresIn,
    //   refreshToken: jwt.encode(refreshToken, 'super_secret_refresh'),
    //   refreshTokenExpirationDate: refreshToken.expiresIn,
    // };
    return done(null, user);
  }).catch((err) => done({ message: err.message }, false));
});
