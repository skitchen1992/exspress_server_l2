import { query } from 'express-validator';

export const sanitizerMiddleware = (fields?: string | string[]) => {
  return query(fields).notEmpty().escape();
};
