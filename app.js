// const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { users } = require('./routes/users');
const { cards } = require('./routes/cards');

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Подключение к БД настроено');
  })
  .catch(() => {
    console.log('Подключения к БД нет');
  });

app.use((req, res, next) => {
  req.user = {
    _id: '64adb830947f33d9aa229096',
  };

  next();
});
app.use('/users', users);
app.use('/cards', cards);

app.listen(PORT, () => {
  console.log(`port is ${PORT}`);
});
