const LocalStrategy = require('passport-local');
const jwt = require('jwt-simple');
const dotenv = require('dotenv'); 

dotenv.config();

const { UserDB } = require('../../users/models/UserDB');

const opts = {
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true,
  session: false,
};

module.exports = new LocalStrategy(opts, async (req, email, password, done) => {
  UserDB.checkPassword(email, password).then((checkPasswordResponse) => {
    if (!checkPasswordResponse.flag) {
      return done({ message: checkPasswordResponse.message }, false);
    }

    const { user } = checkPasswordResponse;

    const accessToken = {
      id: user.getId(),
      expiresIn: new Date().setTime(new Date().getTime() + 2000000),
    };

    const refreshToken = {
      email: user.email,
      expiresIn: new Date().setTime(new Date().getTime() + 1000000),
    };

    const responseData = user.getInfo();

    responseData.tokens = {
      accessToken: jwt.encode(accessToken, process.env.secretKey),
      accessTokenExpirationDate: accessToken.expiresIn,
      refreshToken: jwt.encode(refreshToken, process.env.refreshTokenKey),
      refreshTokenExpirationDate: refreshToken.expiresIn,
    };

    return done(null, responseData);
  }).catch((err) => done({ message: err.message }, false));
});
