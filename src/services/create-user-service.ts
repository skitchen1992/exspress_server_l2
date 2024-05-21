import { CreateUserSchema, GetUserSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { usersCollection } from '../db';
import { queryRepository } from '../repositories/queryRepository';
import { UserDbType } from '../types/users-types';
import { getCurrentDate, passwordBuilder } from '../utils/helpers';

export const createUserService = async (body: CreateUserSchema) => {
  const passwordHash = await passwordBuilder.hashPassword(body.password);

  const newUser: UserDbType = {
    login: body.login,
    password: passwordHash,
    email: body.email,
    createdAt: getCurrentDate(),
  };

  const { insertedId } = await mongoDBRepository.add<UserDbType>(usersCollection, newUser);

  const user = await queryRepository.findAndMapUser<UserDbType, GetUserSchema>(usersCollection, insertedId.toString());

  if (user) {
    return user;
  } else {
    return null;
  }
};
