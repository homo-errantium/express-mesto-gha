const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
const auth = require('./middlewares/auth');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    console.log('Подключение к БД настроено');
  })
  .catch(() => {
    console.log('Подключения к БД нет');
  });

app.post('/signup', createUser);
app.post('/signin', login);

app.use('/users', auth, users);
app.use('/cards', auth, cards);
app.use('*', wrongRouter);

app.listen(PORT, () => {
  console.log(`port is ${PORT}`);
});
