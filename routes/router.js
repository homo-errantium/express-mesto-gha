const router = require('express').Router(); // создали роутер
const { createUser, getUser, getAllUsers } = require('../controllers/users');

// возвращает всех пользователей
router.get('/', getAllUsers);

// возвращает пользователя по _id
router.get('/:userId', getUser);

// создаёт пользователя
router.post('/', createUser);

module.exports = { router }; // экспортировали роутер
