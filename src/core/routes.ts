import express from 'express';
import { Server } from 'socket.io';

import {
  UserController as UserCtrl,
  DialogController as DialogCtrl,
  MessageController as MessageCtrl,
} from '../controllers';
import { updateLastSeen, checkAuth } from '../middlewares';
import { loginValidation } from '../lib';

const createRoutes = (app: express.Express, io: Server): void => {
  app.use(express.json());
  app.use(updateLastSeen);
  app.use(checkAuth);

  const UserController = new UserCtrl(io);
  const DialogController = new DialogCtrl(io);
  const MessageController = new MessageCtrl(io);

  app.get('/user/me', UserController.getMe);
  app.get('/user/:id', UserController.show);
  app.post('/user/registration', UserController.create);
  app.post('/user/login', loginValidation, UserController.login);
  app.delete('/user/:id', UserController.delete);

  app.get('/dialogs', DialogController.index);
  app.post('/dialogs', DialogController.create);
  app.delete('/dialogs/:id', DialogController.delete);

  app.get('/messages', MessageController.index);
  app.post('/messages', MessageController.create);
  app.delete('/messages/:id', MessageController.delete);
};

export default createRoutes;
