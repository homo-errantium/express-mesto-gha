const Card = require('../models/card');
const BadRequestError = require('../errors/BadRequestError');
const ServerError = require('../errors/ServerError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const { CREATE_CODE, SUCCES_CODE } = require('../utils/constants');

// 400 — Переданы некорректные данные при создании карточки. 500 — Ошибка по умолчанию.
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATE_CODE).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError(
          'Переданы некорректные данные при создании карточки.',
        );
      }
      return new ServerError('Ошибка по умолчанию');
    })
    .catch(next);
};

// 404 — Карточка с указанным _id не найдена.
module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail()
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id !== owner) {
        return next(
          new ForbiddenError(
            'У Вас недостаточно прав для совершения данной операции.',
          ),
        );
      }
      return Card.deleteOne(card)
        .then(() => {
          res.status(SUCCES_CODE).send({ data: card });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        throw new NotFoundError('Карточка с указанным _id не найдена');
      }
      if (err.name === 'CastError') {
        throw new BadRequestError('Введены некорректные данные');
      }
      return new ServerError('Ошибка по умолчанию');
    })
    .catch(next);
};

module.exports.getAllCards = (req, res, next) => {
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
      throw new ServerError(err.message);
    })
    .catch(next);
};

// 400 — Переданы некорректные данные для постановки/снятии лайка...
module.exports.likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
  { new: true },
)
  .orFail()
  .then((card) => res.status(SUCCES_CODE).send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError(
        'Переданы некорректные данные для постановки лайка',
      );
    }
    if (err.name === 'DocumentNotFoundError') {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }
    return new ServerError('Ошибка по умолчанию');
  })
  .catch(next);

//  404 — Передан несуществующий _id карточки. 500 — Ошибка по умолчанию.
module.exports.dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } }, // убрать _id из массива
  { new: true },
)
  .orFail()
  .then((card) => res.status(SUCCES_CODE).send({ data: card }))
  .catch((err) => {
    if (err.name === 'CastError') {
      throw new BadRequestError(
        'Переданы некорректные данные для снятии лайка',
      );
    }
    if (err.name === 'DocumentNotFoundError') {
      throw new NotFoundError('Передан несуществующий _id карточки.');
    }
    return new ServerError('Ошибка по умолчанию');
  })
  .catch(next);
