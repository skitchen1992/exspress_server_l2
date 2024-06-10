import { mongoDBRepository } from '../repositories/db-repository';
import { tokensCollection } from '../db/collection';
import { ResultStatus } from '../types/common/result';
import { TokenDbType } from '../types/tokens-types';

export const logoutService = async (refreshToken: string) => {
  const tokenFromDb = await mongoDBRepository.getByField<TokenDbType>(tokensCollection, ['refreshToken'], refreshToken);

  if (!tokenFromDb) {
    return { status: ResultStatus.Unauthorized, data: null };
  }

  if (tokenFromDb.isExpired) {
    return { status: ResultStatus.Unauthorized, data: null };
  }

  const updateResult = await mongoDBRepository.update<TokenDbType>(tokensCollection, tokenFromDb._id.toString(), {
    isExpired: true,
  });

  if (updateResult.modifiedCount === 1) {
    return { status: ResultStatus.Success, data: null };
  }

  return { status: ResultStatus.Unauthorized, data: null };
};
