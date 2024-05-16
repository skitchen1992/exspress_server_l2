import { RequestWithBody } from '../types/request-types';
import { CreateUserSchema, GetUserSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { usersCollection } from '../db';
import { queryRepository } from '../repositories/queryRepository';
import { UserDbType } from '../types/users-types';

export const createUserService = async (req: RequestWithBody<CreateUserSchema>) => {
  const newUser: UserDbType = {
    login: req.body.login,
    password: req.body.password,
    email: req.body.email,
    createdAt: new Date().toISOString(),
  };

  const { insertedId } = await mongoDBRepository.add<UserDbType>(usersCollection, newUser);

  const user = await queryRepository.findAndMapUser<UserDbType, GetUserSchema>(usersCollection, insertedId.toString());

  if (user) {
    return user;
  } else {
    return null;
  }
};
