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
  User.create({ name, about, avatar })
    // .orFail()
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
      // if (err.kind === 'ObjectID') {
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
