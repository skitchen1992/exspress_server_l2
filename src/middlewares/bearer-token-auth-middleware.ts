import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUSES } from '../utils/consts';
import { jwtService } from '../services/jwt-service';
import { JwtPayload } from 'jsonwebtoken';
import { mongoDBRepository } from '../repositories/db-repository';
import { UserDbType } from '../types/users-types';
import { blogsCollection, usersCollection } from '../db/collection';
import { BlogDbType } from '../types/blog-types';

export const bearerTokenAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader.indexOf('Bearer ') === -1) {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    return;
  }

  const [_, token] = authHeader.split(' ');

  const { userId } = jwtService.verifyToken(token) as JwtPayload;

  const userFromDB = await mongoDBRepository.getById<UserDbType>(usersCollection, userId);

  if (userFromDB) {
    res.locals.user = { userId: userFromDB._id.toString(), userLogin: userFromDB.login };
    next();
  } else {
    res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
  }
};
