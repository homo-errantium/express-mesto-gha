const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
// const cookieParser = require('cookie-parser');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } =
  process.env;

const app = express();
const auth = require('./middlewares/auth');
const {
  validationLogin,
  validationCreateUser,
} = require('./middlewares/validation/validationUser');

app.use(express.json());
app.use(bodyParser.json());
// app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

const { users } = require('./routes/users');
const { cards } = require('./routes/cards');
const { wrongRouter } = require('./routes/wrongRoutes');
const { createUser, login } = require('./controllers/users');

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('Подключение к БД настроено');
  })
  .catch(() => {
    // eslint-disable-next-line no-console
    console.log('Подключения к БД нет');
  });

app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.use('*', wrongRouter);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
  });
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`port is ${PORT}`);
});
