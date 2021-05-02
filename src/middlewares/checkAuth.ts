import express from 'express';
import { verifyJWTToken } from '../lib';

// eslint-disable-next-line
const checkAuth = (req: any, res: express.Response, next: express.NextFunction) => {
  if (req.path === '/user/signin' || req.path === '/user/signup' || req.path === '/user/verify') {
    return next();
  }

  const token = req.headers.token;

  verifyJWTToken(token)
    .then((user: any) => {
      req.user = user.data._doc;
      next();
    })
    .catch(() => {
      res.status(403).json({ message: 'Invalid auth token provided.' });
    });
};

export default checkAuth;
