import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { AuthUserSchema } from '../../models/Auth/AuthUserSchema';
import { mongoDBRepository } from '../../repositories/db-repository';
import { UserDbType } from '../../types/users-types';
import { usersCollection } from '../../db';
import { passwordRepository } from '../../repositories/bcrypt-password-repository';

export const authController = async (req: RequestWithBody<AuthUserSchema>, res: Response<ResponseErrorSchema>) => {
  try {
    const user = await mongoDBRepository.getByField<UserDbType>(
      usersCollection,
      ['login', 'email'],
      req.body.loginOrEmail
    );

    if (user) {
      const isCorrectPass = await passwordRepository.comparePasswords(req.body.password, user.password);

      if (isCorrectPass) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      } else {
        res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({
          errorsMessages: [
            {
              message: 'Password or login is wrong',
              field: 'User',
            },
          ],
        });
      }
    } else {
      res.status(HTTP_STATUSES.UNAUTHORIZED_401).json({
        errorsMessages: [
          {
            message: 'Password or login is wrong',
            field: 'User',
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};
