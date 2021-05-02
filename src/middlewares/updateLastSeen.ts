import express from 'express';
import { UserModel } from '../models';

const updateLastSeen = (
  req: express.Request,
  __: express.Response,
  next: express.NextFunction,
): void => {
  if (req.user) {
    UserModel.findOneAndUpdate(
      { _id: req.user._id },
      {
        last_seen: new Date(),
      },
      { new: true },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      () => {},
    );
  }
  next();
};

export default updateLastSeen;
