import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { AuthUserSchema } from '../../models';
import { mongoDBRepository } from '../../repositories/db-repository';
import { UserDbType } from '../../types/users-types';
import { usersCollection } from '../../db/collection';
import { hashBuilder } from '../../utils/helpers';
import { jwtService } from '../../services/jwt-service';
import { AuthUserSchemaResponse } from '../../models';

export const authController = async (
  req: RequestWithBody<AuthUserSchema>,
  res: Response<ResponseErrorSchema | AuthUserSchemaResponse>
) => {
  try {
    const user = await mongoDBRepository.getByField<UserDbType>(
      usersCollection,
      ['login', 'email'],
      req.body.loginOrEmail
    );

    if (user) {
      const isCorrectPass = await hashBuilder.compare(req.body.password, user.password);

      const token = jwtService.generateToken(
        { userId: user._id.toString(), userLogin: user.login },
        { expiresIn: '30 days' }
      );

      if (isCorrectPass) {
        res.status(HTTP_STATUSES.OK_200).json({ accessToken: token });
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
            message: 'Login or Password  is wrong',
            field: 'User',
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};
