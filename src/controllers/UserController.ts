import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { Server } from 'socket.io';
import { validationResult } from 'express-validator';

import { UserModel } from '../models';
import { createJWTToken } from '../lib';

export default class UserController {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public show = (req: Request, res: Response): Response | void => {
    const id = req.params.id;
    UserModel.findById(id, (err: unknown, user: unknown) => {
      if (err) {
        return res.status(404).json({
          message: 'Not found',
        });
      }
      res.json(user);
    });
  };

  public create = (req: Request, res: Response): any => {
    const postData = {
      email: req.body.email,
      fullname: req.body.fullname,
      password: req.body.password,
    };

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array() });
    }

    const user = new UserModel(postData);

    user
      .save()
      .then((obj: unknown) => {
        res.json(obj);
      })
      .catch((reason: any) => {
        res.status(500).json({
          status: 'error',
          message: reason,
        });
      });
  };

  public delete = (req: Request, res: Response): void => {
    const id = req.params.id;

    UserModel.findOneAndRemove({ _id: id })
      .then(user => {
        if (user) {
          res.json({
            message: `User ${user.fullname} deleted`,
          });
        }
      })
      .catch(() => {
        res.json({
          message: `User not found`,
        });
      });
  };

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public login = (req: Request, res: Response) => {
    const postData = {
      email: req.body.email,
      password: req.body.password,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    UserModel.findOne({ email: postData.email }, (err: unknown, user: any) => {
      if (err || !user) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (bcrypt.compareSync(postData.password, user.password)) {
        const token = createJWTToken(user);
        res.json({
          status: 'success',
          token,
        });
      } else {
        res.json({
          status: 'error',
          message: 'Incorrect password or email',
        });
      }
    });
  };

  public getMe = (req: Request, res: Response): void => {
    const id = req.user?._id;

    UserModel.findById(id, (err: any, user: any) => {
      if (err) {
        return res.status(404).json({
          message: 'User not found',
        });
      }
      res.json(user);
    });
  };

  public verify = (req: Request, res: Response): any => {
    const hash: any = req.query.hash;

    if (!hash) {
      return res.status(422).json({ errors: 'Invalid hash' });
    }

    UserModel.findOne({ confirm_hash: hash }, (err: any, user: any) => {
      if (err || !user) {
        return res.status(404).json({
          status: 'error',
          message: 'Hash not found',
        });
      }

      user.confirmed = true;
      user.save((err: any) => {
        if (err) {
          return res.status(404).json({
            status: 'error',
            message: err,
          });
        }

        res.json({
          status: 'success',
          message: 'Аккаунт успешно подтвержден!',
        });
      });
    });
  };
}
