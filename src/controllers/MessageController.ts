import { Request, Response } from 'express';
import { MessageModel, DialogModel } from '../models';
import { Server } from 'socket.io';

export default class MessageController {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  public index = (req: Request, res: Response): void => {
    const dialogId: any = req.query.dialog;

    MessageModel.find({ dialog: dialogId })
      .populate(['dialog', 'user'])
      .exec(function (err, messages) {
        if (err) {
          return res.status(404).json({
            message: 'Messages not found',
          });
        }
        return res.json(messages);
      });
  };

  public create = (req: Request, res: Response): void => {
    const userId = req.user?._id;

    const postData = {
      text: req.body.text,
      dialog: req.body.dialog_id,
      user: userId,
    };

    const message = new MessageModel(postData);

    message
      .save()
      .then((obj: any) => {
        obj.populate(['dialog', 'user'], (e: any, message: any) => {
          if (e) {
            return res.status(500).json({
              status: 'error',
              message: e,
            });
          }

          DialogModel.findOneAndUpdate(
            { _id: postData.dialog },
            { lastMessage: message._id },
            { upsert: true },
            function (err) {
              if (err) {
                return res.status(500).json({
                  status: 'error',
                  message: err,
                });
              }
            },
          );

          res.json(message);
          this.io.emit('SERVER:NEW_MESSAGE', message);
        });
      })
      .catch(reason => {
        res.json(reason);
      });
  };

  public delete = (req: Request, res: Response): void => {
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
