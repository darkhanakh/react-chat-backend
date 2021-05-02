import { Request, Response } from 'express';
import { Server } from 'socket.io';

import { DialogModel, MessageModel, UserModel } from '../models';

export default class DialogController {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public index = (req: Request, res: Response): void => {
    const userId: any = req.user?._id;

    DialogModel.find()
      .or([{ author: userId }, { partner: userId }])
      .populate(['author', 'partner'])
      .populate({
        path: 'lastMessage',
        populate: {
          path: 'user',
        },
      })
      .exec(function (err, dialogs) {
        if (err) {
          return res.status(404).json({
            message: 'Dialogs not found',
          });
        }
        return res.json(dialogs);
      });
  };

  public create = (req: Request, res: Response): void => {
    const postData = {
      author: req.user?._id,
      partner: req.body.partner,
    };
    const dialog = new DialogModel(postData);

    dialog
      .save()
      .then((dialogObj: any) => {
        const message = new MessageModel({
          text: req.body.text,
          user: req.user?._id,
          dialog: dialogObj._id,
        });

        message
          .save()
          .then(() => {
            dialogObj.lastMessage = message._id;
            dialogObj.save().then(() => {
              res.json(dialogObj);
              this.io.emit('SERVER:DIALOG_CREATED', {
                ...postData,
                dialog: dialogObj,
              });
            });
          })
          .catch(reason => {
            res.json(reason);
          });
      })
      .catch(reason => {
        res.json(reason);
      });
  };

  public delete = (req: Request, res: Response): void => {
    const id = req.params.id;

    DialogModel.findOneAndRemove({ _id: id })
      .then(dialog => {
        if (dialog) {
          res.json({
            message: 'Dialog deleted',
          });
        }
      })
      .catch(() => {
        res.json({
          message: 'Dialog not found',
        });
      });
  };
}
