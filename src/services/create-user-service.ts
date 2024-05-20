import { RequestWithBody } from '../types/request-types';
import { CreateUserSchema, GetUserSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { usersCollection } from '../db';
import { queryRepository } from '../repositories/queryRepository';
import { UserDbType } from '../types/users-types';
import { passwordRepository } from '../repositories/bcrypt-password-repository';
import { getCurrentDate } from '../utils/helpers';

export const createUserService = async (req: RequestWithBody<CreateUserSchema>) => {
  const passwordHash = await passwordRepository.hashPassword(req.body.password);

  const newUser: UserDbType = {
    login: req.body.login,
    password: passwordHash,
    email: req.body.email,
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
