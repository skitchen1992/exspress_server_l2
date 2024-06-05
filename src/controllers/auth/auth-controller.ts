import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { AuthUserSchema, AuthUserSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { hashBuilder } from '../../utils/helpers';
import { jwtService } from '../../services/jwt-service';
import { queryRepository } from '../../repositories/queryRepository';
import { ResultStatus } from '../../types/common/result';

export const authController = async (
  req: RequestWithBody<AuthUserSchema>,
  res: Response<ResponseErrorSchema | AuthUserSchemaResponse>
) => {
  try {
    const { data: user, status } = await queryRepository.getUserByFields(['login', 'email'], req.body.loginOrEmail);

    if (status === ResultStatus.Success) {
      const isCorrectPass = await hashBuilder.compare(req.body.password, user!.password);

      const token = jwtService.generateToken(
        { userId: user!._id.toString(), userLogin: user!.login },
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
