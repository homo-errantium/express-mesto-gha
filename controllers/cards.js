const Card = require('../models/card');
const {
  SERVER_ERROR_CODE,
  NOT_FOUND_CODE,
  BAD_REQUEST_CODE,
  CREATE_CODE,
  SUCCES_CODE,
} = require('../utils/constants');

// 400 — Переданы некорректные данные при создании карточки. 500 — Ошибка по умолчанию.
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATE_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST_CODE).send({
          message: 'Переданы некорректные данные при создании карточки.',
        });
      }
      return res
        .status(SERVER_ERROR_CODE)
        .send({ message: 'Ошибка по умолчанию' });
    });
};

// 404 — Карточка с указанным _id не найдена.
module.exports.deleteCard = (req, res) => {
  if (req.params.owner === req.user._id) {
    Card.findByIdAndRemove(req.params.cardId, {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true,
      // upsert: true, // если пользователь не найден, он будет создан
    })
      .orFail()
      .then((card) => res.status(SUCCES_CODE).send({ data: card }))
      .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          return res
            .status(NOT_FOUND_CODE)
            .send({ message: 'Карточка с указанным _id не найдена' });
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
  } else {
    res
      .status(SUCCES_CODE)
      .send({
        message: 'У вас недостаточно прав для совершения данной операции',
      });
  }
};

module.exports.getAllCards = (req, res) => {
  Card.find(
    {},
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      // upsert: true, // если пользователь не найден, он будет создан
    },
  )
    .then((cards) => res.status(SUCCES_CODE).send({ data: cards }))
    .catch((err) => {
      res
        .status(SERVER_ERROR_CODE)
        .send({ message: `Ошибка по умолчанию. код ${err}` });
    });
};

// 400 — Переданы некорректные данные для постановки/снятии лайка...
module.exports.likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail()
  .then((card) => res.status(SUCCES_CODE).send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_CODE).send({
        message: 'Переданы некорректные данные для постановки лайка',
      });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res
        .status(NOT_FOUND_CODE)
        .send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res
      .status(SERVER_ERROR_CODE)
      .send({ message: 'Ошибка по умолчанию.' });
  });

//  404 — Передан несуществующий _id карточки. 500 — Ошибка по умолчанию.
module.exports.dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail()
  .then((card) => res.status(SUCCES_CODE).send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(BAD_REQUEST_CODE).send({
        message: 'Переданы некорректные данные для снятии лайка',
      });
    }
    if (err.name === 'DocumentNotFoundError') {
      return res
        .status(NOT_FOUND_CODE)
        .send({ message: 'Передан несуществующий _id карточки.' });
    }
    return res
      .status(SERVER_ERROR_CODE)
      .send({ message: 'Ошибка по умолчанию.' });
  });
