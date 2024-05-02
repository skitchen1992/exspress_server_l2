import { RequestWithBody } from '../types/request-types';
import { PostBlogSchema, PostBlogSchemaResponse, ResponseErrorSchema } from '../models';
import { NextFunction, Response } from 'express';
import { validationResult } from 'express-validator';
import { HTTP_STATUSES } from '../utils/consts';

export const errorHandlingMiddleware = (req: RequestWithBody<PostBlogSchema>, res: Response<PostBlogSchemaResponse | ResponseErrorSchema>, next: NextFunction) => {
  const errorsResult = validationResult(req);

  if (errorsResult.isEmpty()) {
    next();
  } else {
    const errorsMessages = errorsResult.array().map((error) => {
      return {
        message: error.msg.massage,
        field: error.msg.field,
      };
    });

    res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages });
  }
};
