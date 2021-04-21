import express from 'express';
import mongoose from 'mongoose';

import { UserController } from './controllers';

const app = express();
const PORT = 9999;

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});

app.use(express.json());

const User = new UserController();

app.get('/user/:id', User.show);
app.delete('/user/:id', User.delete);
app.post('/user/registration', User.create);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
