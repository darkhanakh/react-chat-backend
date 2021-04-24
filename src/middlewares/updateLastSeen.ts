import express from 'express';
import { UserModel } from '../models/';

export default (_: express.Request, __: express.Response, next: express.NextFunction): void => {
  UserModel.findOneAndUpdate(
    { _id: '608133e9b78bca0730c5d550' },
    {
      fullname: 'test',
      last_seen: new Date(),
    },
    { new: true },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
  );
  next();
};
