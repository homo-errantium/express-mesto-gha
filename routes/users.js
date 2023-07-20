const users = require('express').Router(); // создали роутер
const {
  getUser,
  getAllUsers,
  updateUserAvatar,
  updateUserInfo,
  getInfoAboutMe,
} = require('../controllers/users');

// возвращает всех пользователей
users.get('/', getAllUsers);

// возвращает пользователя по _id
users.get('/:userId', getUser);

// возвращает информацию о пользователе
users.get('/me', getInfoAboutMe);

// обновляет информацию о пользователе
users.patch('/me', updateUserInfo);

// обновляет аватар пользователя
users.patch('/me/avatar', updateUserAvatar);

module.exports = { users };
