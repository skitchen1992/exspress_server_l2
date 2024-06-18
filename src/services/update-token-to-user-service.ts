import { mongoDBRepository } from '../repositories/db-repository';
import { tokensCollection } from '../db/collection';
import { ResultStatus } from '../types/common/result';
import { jwtService } from './jwt-service';
import { TokenDbType } from '../types/tokens-types';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../utils/consts';
import { ObjectId } from 'mongodb';
import { getDateFromObjectId } from '../utils/dates/dates';

export const updateTokenToUserService = async (userId: string, refreshToken: string) => {
  const newAccessToken = jwtService.generateToken({ userId }, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });
  const newRefreshToken = jwtService.generateToken({ userId }, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

  const tokenFromDb = await mongoDBRepository.getByField<TokenDbType>(tokensCollection, ['refreshToken'], refreshToken);

  if (!tokenFromDb) {
    return { status: ResultStatus.NotFound, data: null };
  }

  if (tokenFromDb.isExpired) {
    return { status: ResultStatus.Unauthorized, data: null };
  }

  const updateResult = await mongoDBRepository.update<TokenDbType>(tokensCollection, tokenFromDb._id.toString(), {
    isExpired: true,
  });

  if (updateResult.modifiedCount !== 1) {
    return { status: ResultStatus.NotFound, data: null };
  }

  const objectId = new ObjectId();

  const data: TokenDbType = {
    refreshToken: newRefreshToken,
    userId,
    isExpired: false,
    createdAt: getDateFromObjectId(objectId),
    _id: objectId,
  };

  const insertOneResult = await mongoDBRepository.add<TokenDbType>(tokensCollection, data);

  const token = await mongoDBRepository.getById<TokenDbType>(tokensCollection, insertOneResult.insertedId.toString());

  if (!token) {
    return { status: ResultStatus.NotFound, data: null };
  }

  return { status: ResultStatus.Success, data: { refreshToken: token?.refreshToken, accessToken: newAccessToken } };
};
