const jwt = require('jsonwebtoken');
// eslint-disable-next-line import/no-unresolved
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
  BAD_REQUEST_CODE,
  CREATE_CODE,
  SUCCES_CODE,
} = require('../utils/constants');

// 400 — Переданы некорректные данные при создании пользователя. 500 — Ошибка по умолчанию.

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => res.status(CREATE_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

// module.exports.createUser = (req, res) => {
//   const { name, about, avatar, email, password } = req.body;
//   User.create({ name, about, avatar })
//     .then((user) => res.status(CREATE_CODE).send({ data: user }))
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return res.status(BAD_REQUEST_CODE).send({
//           message: 'Переданы некорректные данные при создании пользователя.',
//         });
//       }
//       return res
//         .status(SERVER_ERROR_CODE)
//         .send({ message: 'Ошибка по умолчанию' });
//     });
// };

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getInfoAboutMe = (req, res) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.status(SUCCES_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Введены некорректные данные' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};

// 404 — Пользователь по указанному _id не найден. 500 — Ошибка по умолчанию.
module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => res.status(SUCCES_CODE).send({ data: user }))
    .catch((err) => {
      // если пользователь с данным id не найден
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      // если введены некорректные данные
      if (err.name === 'CastError') {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: 'Введены некорректные данные' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .orFail()
    .then((user) => res.status(SUCCES_CODE).send({ data: user }))
    .catch((err) => {
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `Ошибка по умолчанию. код ${err}` });
    });
};

// 400 — Переданы некорректные данные при обновлении профиля.
// 404 — Пользователь с указанным _id не найден. 500 — Ошибка по умолчанию.
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true, // если пользователь не найден, он будет создан
    },
  )
    // .orFail(new Error('BadRequest'))
    .then((user) => res.status(SUCCES_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};

// 400 — Переданы некорректные данные при обновлении аватара.
// 404 — Пользователь с указанным _id не найден.
// 500 — Ошибка по умолчанию.
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => res.status(SUCCES_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
      }
      if (err.name === 'DocumentNotFoundError') {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка по умолчанию.' });
    });
};
