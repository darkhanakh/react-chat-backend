import { Request, Response } from 'express';
import { DialogModel, MessageModel } from '../models';

export default class DialogController {
  index = (req: Request, res: Response): void => {
    const authorId: any = '608133e9b78bca0730c5d550';

    DialogModel.find({ author: authorId })
      .populate(['author', 'partner'])
      .exec(function (err, dialogs) {
        console.log(err);
        if (err) {
          return res.status(404).json({
            message: 'Dialogs not found',
          });
        }
        return res.json(dialogs);
      });
  };

  create = (req: Request, res: Response): void => {
    const postData = {
      author: req.body.author,
      partner: req.body.partner,
    };
    const dialog = new DialogModel(postData);

    dialog
      .save()
      .then((dialogObj: any) => {
        const message = new MessageModel({
          text: req.body.text,
          user: req.body.author,
          dialog: dialogObj._id,
        });

        message
          .save()
          .then(() => {
            res.json(dialogObj);
          })
          .catch(reason => {
            res.json(reason);
          });
      })
      .catch(reason => {
        res.json(reason);
      });
  };

  delete = (req: Request, res: Response): void => {
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