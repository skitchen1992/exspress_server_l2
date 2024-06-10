import { mongoDBRepository } from '../repositories/db-repository';
import { tokensCollection } from '../db/collection';
import { ResultStatus } from '../types/common/result';
import { jwtService } from './jwt-service';
import { TokenDbType } from '../types/tokens-types';
import { ObjectId } from 'mongodb';
import { ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from '../utils/consts';

export const addTokenToUserService = async (userId: string, userLogin: string) => {
  const accessToken = jwtService.generateToken({ userId, userLogin }, { expiresIn: ACCESS_TOKEN_EXPIRES_IN });

  const refreshToken = jwtService.generateToken({ userId, userLogin }, { expiresIn: REFRESH_TOKEN_EXPIRES_IN });

  const objectId = new ObjectId();

  const data: TokenDbType = {
    refreshToken,
    userId,
    isExpired: false,
    createdAt: objectId.getTimestamp().toISOString(),
    _id: objectId,
  };

  const insertOneResult = await mongoDBRepository.add<TokenDbType>(tokensCollection, data);

  const token = await mongoDBRepository.getById<TokenDbType>(tokensCollection, insertOneResult.insertedId.toString());

  if (token) {
    return { status: ResultStatus.Success, data: { refreshToken: token?.refreshToken, accessToken } };
  } else {
    return { status: ResultStatus.NotFound, data: null };
  }
};
