import { RequestWithBody } from '../types/request-types';
import { ResponseErrorSchema } from '../models';
import { NextFunction, Response } from 'express';
import { Result, validationResult } from 'express-validator';
import { HTTP_STATUSES } from '../utils/consts';
import { ErrorMessageSchema } from '../models/errors/ErrorMessageSchema';
import { FieldValidationError } from 'express-validator/src/base';

export const errorHandlingMiddleware = <T>(
  req: RequestWithBody<T>,
  res: Response<ResponseErrorSchema>,
  next: NextFunction
) => {
  const errorsResult = validationResult(req) as Result<FieldValidationError>;

  if (errorsResult.isEmpty()) {
    next();
  } else {
    const errorsMessages: ErrorMessageSchema[] = errorsResult.array().map((error) => {
      return {
        message: error.msg,
        field: error.path || error.type,
      };
    });

    res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages });
  }
};
