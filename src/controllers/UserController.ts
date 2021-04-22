import { Request, Response } from 'express';
import { UserModel } from '../models';

export default class UserController {
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

  getMe = (): void => {
    // TODO: Сделать возврат информации о самом себе(аутентификация)
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
}
