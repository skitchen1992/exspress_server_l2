import { mongoDBRepository } from '../repositories/db-repository';
import { deviceAuthSessionsCollection } from '../db/collection';
import { ResultStatus } from '../types/common/result';
import { DeviceAuthSessionDbType } from '../types/device-auth-session-types';
import { getCurrentDate, isExpiredDate } from '../utils/dates/dates';
import { jwtService } from './jwt-service';
import { JwtPayload } from 'jsonwebtoken';
import { queryRepository } from '../repositories/queryRepository';

export const logoutService = async (refreshToken: string) => {
  const { userId, deviceId } = (jwtService.verifyToken(refreshToken) as JwtPayload) ?? {};

  if (!userId || !deviceId) {
    return { status: ResultStatus.Unauthorized, data: null };
  }

  const { data: deviceAuthSession } = await queryRepository.getDeviceAuthSession(deviceId);

  if (!deviceAuthSession) {
    return { status: ResultStatus.Unauthorized, data: null };
  }

  if (isExpiredDate(deviceAuthSession.tokenExpirationDate, getCurrentDate())) {
    return { status: ResultStatus.Unauthorized, data: null };
  }

  const updateResult = await mongoDBRepository.update<DeviceAuthSessionDbType>(
    deviceAuthSessionsCollection,
    deviceAuthSession._id.toString(),
    {
      tokenExpirationDate: getCurrentDate(),
      lastActiveDate: getCurrentDate(),
    }
  );

  if (updateResult.modifiedCount === 1) {
    return { status: ResultStatus.Success, data: null };
  }

  return { status: ResultStatus.Unauthorized, data: null };
};
