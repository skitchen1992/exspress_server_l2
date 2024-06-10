import { Response } from 'express';
import { COOKIE_KEY, HTTP_STATUSES } from '../../utils/consts';
import { AuthUserSchema, AuthUserSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { hashBuilder } from '../../utils/helpers';
import { queryRepository } from '../../repositories/queryRepository';
import { ResultStatus } from '../../types/common/result';
import { addTokenToUserService } from '../../services/add-token-to-user-service';

export const authController = async (
  req: RequestWithBody<AuthUserSchema>,
  res: Response<ResponseErrorSchema | AuthUserSchemaResponse>
) => {
  try {
    const { data: user, status } = await queryRepository.getUserByFields(['login', 'email'], req.body.loginOrEmail);

    if (status === ResultStatus.Success) {
      const isCorrectPass = await hashBuilder.compare(req.body.password, user!.password);

      if (isCorrectPass) {
        const { data, status } = await addTokenToUserService(user!._id.toString(), user!.login);

        if (status === ResultStatus.Success && data) {
          req.setCookie(COOKIE_KEY.REFRESH_TOKEN, data.refreshToken);

          res.status(HTTP_STATUSES.OK_200).json({ accessToken: data.accessToken });
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
