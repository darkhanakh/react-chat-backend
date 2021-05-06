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
    const userId = req.user?._id;

    MessageModel.updateMany(
      { dialog: dialogId, user: { $ne: userId } },
      // @ts-ignore
      { $set: { readed: true } },
      (err: any) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            status: 'error',
            message: err,
          });
        }
      },
    );

    MessageModel.find({ dialog: dialogId })
      .populate(['dialog', 'user', 'attachments'])
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
      attachments: req.body.attachments,
      user: userId,
    };

    const message = new MessageModel(postData);

    message
      .save()
      .then((obj: any) => {
        obj.populate(['dialog', 'user', 'attachments'], (err: any, message: any) => {
          if (err) {
            return res.status(500).json({
              status: 'error',
              message: err,
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
    const id: any = req.query.id;
    const userId: any = req.user?._id;

    MessageModel.findById(id, (err: any, message: any) => {
      if (err || !message) {
        return res.status(404).json({
          status: 'error',
          message: 'Message not found',
        });
      }

      if (message.user.toString() === userId) {
        const dialogId = message.dialog;
        message.remove();

        MessageModel.findOne(
          { dialog: dialogId },
          {},
          { sort: { created_at: -1 } },
          (err, lastMessage) => {
            if (err) {
              res.status(500).json({
                status: 'error',
                message: err,
              });
            }

            DialogModel.findById(dialogId, (err: any, dialog: any) => {
              if (err) {
                res.status(500).json({
                  status: 'error',
                  message: err,
                });
              }

              dialog.lastMessage = lastMessage;
              dialog.save();
            });
          },
        );

        return res.json({
          status: 'success',
          message: 'Message deleted',
        });
      } else {
        return res.status(403).json({
          status: 'error',
          message: 'Not have permission',
        });
      }
    });
  };
}
