import express from 'express';
import mongoose from 'mongoose';

import { UserController, DialogController, MessageController } from './controllers';

const app = express();
const PORT = 9999;

mongoose.connect('mongodb://localhost:27017/chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

app.use(express.json());

const User = new UserController();
const Dialog = new DialogController();
const Messages = new MessageController();

app.get('/user/:id', User.show);
app.delete('/user/:id', User.delete);
app.post('/user/registration', User.create);

app.get('/dialogs', Dialog.index);
app.post('/dialogs', Dialog.create);
app.delete('/dialogs/:id', Dialog.delete);

app.get('/messages', Messages.index);
app.post('/messages', Messages.create);
app.delete('/messages/:id', Messages.delete);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
