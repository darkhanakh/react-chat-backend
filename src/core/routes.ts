import express from 'express';
import { Server } from 'socket.io';

import multer from './multer';
import {
  UserController as UserCtrl,
  DialogController as DialogCtrl,
  MessageController as MessageCtrl,
  UploadController as UploadCtrl,
} from '../controllers';
import { updateLastSeen, checkAuth } from '../middlewares';
import { loginValidation, registerValidation } from '../lib';

const createRoutes = (app: express.Express, io: Server): void => {
  const UserController = new UserCtrl(io);
  const DialogController = new DialogCtrl(io);
  const MessageController = new MessageCtrl(io);
  const UploadController = new UploadCtrl();

  app.use(express.json());
  app.use(updateLastSeen);
  app.use(checkAuth);

  app.get('/user/me', UserController.getMe);
  app.get('/user/verify', UserController.verify);
  app.post('/user/signup', registerValidation, UserController.create);
  app.post('/user/signin', loginValidation, UserController.login);
  app.get('/user/find', UserController.findUsers);
  app.get('/user/:id', UserController.show);
  app.delete('/user/:id', UserController.delete);

  app.get('/dialogs', DialogController.index);
  app.post('/dialogs', DialogController.create);
  app.delete('/dialogs/:id', DialogController.delete);

  app.get('/messages', MessageController.index);
  app.post('/messages', MessageController.create);
  app.delete('/messages', MessageController.delete);

  app.post('/files', multer.single('file'), UploadController.create);
  app.delete('/files', UploadController.delete);
};

export default createRoutes;
