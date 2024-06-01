import { mongoDBRepository } from '../repositories/db-repository';
import { usersCollection } from '../db/collection';
import { ResultStatus } from '../types/common/result';
import { UserDbType } from '../types/users-types';

export const updateUserConfirmationService = async (id: string) => {
  const updateResult = await mongoDBRepository.update<UserDbType>(usersCollection, id, {
    'emailConfirmation.isConfirmed': true,
  });

  if (updateResult.modifiedCount === 1) {
    return { status: ResultStatus.Success };
  } else {
    return { status: ResultStatus.NotFound };
  }
};
