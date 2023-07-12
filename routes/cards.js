const cards = require('express').Router(); // создали роутер
const { createCard, deleteCard, getAllCards } = require('../controllers/cards');

// возвращает все карточки
cards.get('/', getAllCards);

// возвращает карточку по _id
cards.delete('/:cardId', deleteCard);

// создаёт карточку
cards.post('/', createCard);

module.exports = { cards }; // экспортировали роутер
