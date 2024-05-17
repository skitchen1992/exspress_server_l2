import { mongoDBRepository } from '../repositories/db-repository';
import { usersCollection } from '../db';
import { UserDbType } from '../types/users-types';
import { body } from 'express-validator';

export const checkUserExistsMiddleware = {
  body: (fields?: string | string[]) => {
    return body(fields).custom(async (value) => {
      const user = await mongoDBRepository.getByField<UserDbType>(usersCollection, fields, value);

      if (user?._id) {
        throw new Error('User exists');
      }
    });
  },
};
