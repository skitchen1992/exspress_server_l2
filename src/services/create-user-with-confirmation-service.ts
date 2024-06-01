import { mongoDBRepository } from '../repositories/db-repository';
import { usersCollection } from '../db/collection';
import { UserDbType } from '../types/users-types';
import { hashBuilder } from '../utils/helpers';
import { ResultStatus } from '../types/common/result';
import { CreateUserWithConfirmationSchema } from '../models/auth/CreateUserWithConfirmationSchema';
import { v4 as uuidv4 } from 'uuid';
import { add, getCurrentDate } from '../utils/dates/dates';

export const createUserWithConfirmationService = async (body: CreateUserWithConfirmationSchema) => {
  const passwordHash = await hashBuilder.hash(body.password);

  const newUser: UserDbType = {
    login: body.login,
    password: passwordHash,
    email: body.email,
    createdAt: getCurrentDate(),
    emailConfirmation: {
      isConfirmed: false,
      confirmationCode: uuidv4(),
      expirationDate: add(new Date(), { hours: 1 }),
    },
  };

  const { insertedId, acknowledged } = await mongoDBRepository.add<UserDbType>(usersCollection, newUser);

  if (acknowledged) {
    return { data: insertedId.toString(), status: ResultStatus.Success };
  } else {
    return { data: null, status: ResultStatus.BagRequest };
  }
};
