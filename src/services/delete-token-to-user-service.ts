import { ResultStatus } from '../types/common/result';
import { jwtService } from './jwt-service';
import { JwtPayload } from 'jsonwebtoken';
import { mongoDBRepository } from '../repositories/db-repository';
import { DeviceAuthSessionDbType } from '../types/device-auth-session-types';
import { deviceAuthSessionsCollection } from '../db/collection';
import { queryRepository } from '../repositories/queryRepository';

export const deleteTokenToUserService = async (refreshToken: string, userAgentHeader?: string) => {
  const { deviceId } = (jwtService.decodeToken(refreshToken) as JwtPayload) ?? {};

  if (!deviceId || !userAgentHeader) {
    return { status: ResultStatus.NotFound, data: null };
  }

  const { data: deviceAuthSession } = await queryRepository.getDeviceAuthSession(deviceId);

  if (!deviceAuthSession) {
    return { status: ResultStatus.Unauthorized, data: null };
  }

  if (deviceAuthSession.title !== userAgentHeader) {
    return { status: ResultStatus.NotFound, data: null };
  }

  const deleteResult = await mongoDBRepository.delete<DeviceAuthSessionDbType>(
    deviceAuthSessionsCollection,
    deviceAuthSession._id.toString()
  );

  if (deleteResult.deletedCount === 1) {
    return { status: ResultStatus.Success, data: null };
  } else {
    return { status: ResultStatus.NotFound, data: null };
  }
};
