const users = require('express').Router();

const {
  getUser,
  getAllUsers,
  updateUserAvatar,
  updateUserInfo,
  getCurrentUser,
} = require('../controllers/users');

const {
  validationUpdateUserInfo,
  validationUpdateUserAvatar,
  validationUserID,
} = require('../middlewares/validation/validationUser');

// возвращает всех пользователей
users.get('/', getAllUsers);

// возвращает информацию о пользователе
users.get('/me', getCurrentUser);

// возвращает пользователя по _id
users.get('/:userId', validationUserID, getUser);

// обновляет информацию о пользователе
users.patch('/me', validationUpdateUserInfo, updateUserInfo);

// обновляет аватар пользователя
users.patch('/me/avatar', validationUpdateUserAvatar, updateUserAvatar);

module.exports = { users };
