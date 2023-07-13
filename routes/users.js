const users = require('express').Router(); // создали роутер
const {
  createUser,
  getUser,
  getAllUsers,
  updateUserAvatar,
  updateUserInfo,
} = require('../controllers/users');

// возвращает всех пользователей
users.get('/', getAllUsers);

// возвращает пользователя по _id
users.get('/:userId', getUser);

// создаёт пользователя
users.post('/', createUser);

// обновляет информацию о пользователе
users.patch('/me', updateUserInfo);

// обновляет аватар пользователя
users.patch('/me/avatar', updateUserAvatar);

module.exports = { users };
