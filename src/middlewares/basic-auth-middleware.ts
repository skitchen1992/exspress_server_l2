import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../utils/consts';
import { SETTINGS } from '../utils/settings';

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (!auth) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }

  const buff = Buffer.from(auth.slice(6), 'base64');
  const decodedAuth = buff.toString('utf8');

  const [username, password] = decodedAuth.split(':');

  if (username === SETTINGS.ADMIN_AUTH_USERNAME && password === SETTINGS.ADMIN_AUTH_PASSWORD) {
    next();
  } else {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  }
};
