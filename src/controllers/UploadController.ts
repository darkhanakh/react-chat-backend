import { Request, Response } from 'express';

import cloudinary from '../core/cloudinary';

import { UploadFileModel } from '../models';

export default class UploadController {
  public create = (req: Request, res: Response): void => {
    const userId = req.user?._id;
    const file: any = req.file;

    cloudinary.uploader
      .upload_stream({ resource_type: 'auto' }, (error: any, result: any) => {
        if (error) {
          throw new Error(error);
        }

        const fileData = {
          filename: result.original_filename,
          size: result.bytes,
          ext: result.format,
          url: result.url,
          user: userId,
        };

        const uploadFile = new UploadFileModel(fileData);

        uploadFile
          .save()
          .then((fileObj: any) => {
            res.json({
              status: 'success',
              file: fileObj,
            });
          })
          .catch((err: any) => {
            res.json({
              status: 'error',
              message: err,
            });
          });
      })
      .end(file.buffer);
  };

  public delete = (req: Request, res: Response): void => {
    const fileId = req.user?._id;
    UploadFileModel.deleteOne({ _id: fileId }, function (err: any) {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: err,
        });
      }
      res.json({
        status: 'success',
      });
    });
  };
}
