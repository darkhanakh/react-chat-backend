import { Request, Response } from 'express';
import { MessageModel } from '../models';

export default class MessageController {
  index = (req: Request, res: Response): void => {
    const dialogId: any = req.query.dialog;

    MessageModel.find({ dialog: dialogId })
      .populate(['dialog'])
      .exec(function (err, messages) {
        if (err) {
          return res.status(404).json({
            message: 'Messages not found',
          });
        }
        return res.json(messages);
      });
  };

  create = (req: Request, res: Response): void => {
    const userId = '608133e9b78bca0730c5d550';

    const postData = {
      text: req.body.text,
      dialog: req.body.dialog_id,
      user: userId,
    };

    const message = new MessageModel(postData);

    message
      .save()
      .then((obj: any) => {
        res.json(obj);
      })
      .catch(reason => {
        res.json(reason);
      });
  };

  delete = (req: Request, res: Response): void => {
    const id: string = req.params.id;

    MessageModel.findOneAndRemove({ _id: id })
      .then(message => {
        if (message) {
          res.json({
            message: `Message deleted`,
          });
        }
      })
      .catch(() => {
        res.json({
          message: `Message not found`,
        });
      });
  };
}
