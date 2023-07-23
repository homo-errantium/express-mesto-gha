const cards = require('express').Router(); // создали роутер
const {
  createCard,
  deleteCard,
  getAllCards,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validationCreateCard,
  validationCardID,
} = require('../middlewares/validation/validationCard');

// возвращает все карточки
cards.get('/', getAllCards);

// создаёт карточку
cards.post('/', validationCreateCard, createCard);

// удаляет карточку по _id
cards.delete('/:cardId', validationCardID, deleteCard);

// создаёт лайк
cards.put('/:cardId/likes', validationCardID, likeCard);

// убирает лайк
cards.delete('/:cardId/likes', validationCardID, dislikeCard);

module.exports = { cards }; // экспортировали роутер
