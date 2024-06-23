import { Response } from 'express';
import { COOKIE_KEY, HTTP_STATUSES } from '../../utils/consts';
import { AuthUserSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestEmpty } from '../../types/request-types';
import { jwtService } from '../../services/jwt-service';
import { JwtPayload } from 'jsonwebtoken';
import { updateTokenToUserService } from '../../services/update-token-to-user-service';
import { ResultStatus } from '../../types/common/result';
import { fromUnixTimeToISO } from '../../utils/dates/dates';

export const refreshTokenController = async (
  req: RequestEmpty,
  res: Response<ResponseErrorSchema | AuthUserSchemaResponse>
) => {
  try {
    const refreshToken = req.getCookie(COOKIE_KEY.REFRESH_TOKEN);

    if (!refreshToken) {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
      return;
    }

    const { userId, deviceId, exp } = (jwtService.verifyToken(refreshToken) as JwtPayload) ?? {};

    if (!userId || !deviceId || !exp) {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
      return;
    }

    const { data, status } = await updateTokenToUserService(userId, deviceId, exp);

    if (status === ResultStatus.Success && data) {
      req.setCookie(COOKIE_KEY.REFRESH_TOKEN, data.refreshToken);

      res.status(HTTP_STATUSES.OK_200).json({ accessToken: data.accessToken });
    } else {
      res.sendStatus(HTTP_STATUSES.UNAUTHORIZED_401);
    }
  } catch (e) {
    console.log(e);
  }
};
