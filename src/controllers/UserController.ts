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

  show = (req: Request, res: Response): Response | void => {
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

  create = (req: Request, res: Response): void => {
    const postData = {
      email: req.body.email,
      fullname: req.body.fullname,
      password: req.body.password,
    };
    const user = new UserModel(postData);
    user
      .save()
      .then((obj: unknown) => {
        res.json(obj);
      })
      .catch((e: unknown) => {
        res.json(e);
      });
  };

  delete = (req: Request, res: Response): void => {
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
  login = (req: Request, res: Response) => {
    const postData = {
      email: req.body.email,
      password: req.body.password,
    };

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    UserModel.findOne({ email: postData.email }, (err: unknown, user: any) => {
      if (err) {
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

  getMe = (req: Request, res: Response): void => {
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
}
