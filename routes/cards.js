const cards = require('express').Router(); // создали роутер
const { createCard, deleteCard, getAllCards, likeCard, dislikeCard } = require('../controllers/cards');

// возвращает все карточки
cards.get('/', getAllCards);

// возвращает карточку по _id
cards.delete('/:cardId', deleteCard);

// создаёт карточку
cards.post('/', createCard);

// создаёт лайк
cards.put('/:cardId/likes', likeCard);

// убирает лайк
cards.delete('/:cardId/likes', dislikeCard);

module.exports = { cards }; // экспортировали роутер
