const jwt = require('jsonwebtoken');
const { AuthError } = require('../errors/AuthError');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new AuthError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return new AuthError('Необходима авторизация');
  }
  req.user = payload;
  next();
};

// eslint-disable-next-line consistent-return

// module.exports = (req, res, next) => {
//   if (!res.cookies) {
//     return new AuthError('Необходима авторизация');
//   }

//   const token = res.cookies.jwt;
//   let payload;

//   try {
//     payload = jwt.verify(token, 'some-secret-key');
//   } catch (err) {
//     return new AuthError('Необходима авторизация');
//   }
//   req.user = payload;
//   next();
// };