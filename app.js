const helmet = require('helmet');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT, DB_URL } = require('./utils/constants');

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { users } = require('./routes/users');
const { cards } = require('./routes/cards');
const { wrongRouter } = require('./routes/wrongRoutes');

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

app.use(
  helmet((req, res, next) => {
    req.user = {
      _id: '64adb830947f33d9aa229096',
    };

    next();
  }),
);
app.use(helmet('/users', users));
app.use(helmet('/cards', cards));
app.use(helmet('*', wrongRouter));

app.listen(PORT, () => {
  console.log(`port is ${PORT}`);
});
