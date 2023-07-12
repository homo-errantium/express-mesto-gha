const users = require('express').Router(); // создали роутер
const { createUser, getUser, getAllUsers } = require('../controllers/users');

// возвращает всех пользователей
users.get('/', getAllUsers);

// возвращает пользователя по _id
users.get('/:userId', getUser);

// создаёт пользователя
users.post('/', createUser);

module.exports = { users }; // экспортировали роутер
