import { mongoDBRepository } from '../repositories/db-repository';
import { deviceAuthSessionsCollection } from '../db/collection';
import { ResultStatus } from '../types/common/result';
import { jwtService } from './jwt-service';
import { DeviceAuthSessionDbType } from '../types/device-auth-session-types';
import { ObjectId } from 'mongodb';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../utils/consts';
import { getDateFromObjectId } from '../utils/dates/dates';
import { getUniqueId } from '../utils/helpers';

type Payload = {
  userId: string;
  ip: string;
  title: string;
  deviceIdFromCookie?: string;
};

export const addTokenToUserService = async (payload: Payload) => {
  const { userId, ip, title, deviceIdFromCookie } = payload;

  const objectId = new ObjectId();
  const deviceId = deviceIdFromCookie || getUniqueId();

  const accessToken = jwtService.generateToken({ userId }, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

  const refreshToken = jwtService.generateToken({ userId, deviceId }, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

  const data: DeviceAuthSessionDbType = {
    _id: objectId,
    userId,
    ip,
    title,
    lastActiveDate: getDateFromObjectId(objectId),
    tokenIssueDate: getDateFromObjectId(objectId),
    tokenExpirationDate: jwtService.getTokenExpirationDate(refreshToken),
    deviceId,
  };

  const insertOneResult = await mongoDBRepository.add<DeviceAuthSessionDbType>(deviceAuthSessionsCollection, data);

  const session = await mongoDBRepository.getById<DeviceAuthSessionDbType>(
    deviceAuthSessionsCollection,
    insertOneResult.insertedId.toString()
  );

  if (session) {
    return { status: ResultStatus.Success, data: { refreshToken, accessToken } };
  } else {
    return { status: ResultStatus.NotFound, data: null };
  }
};
