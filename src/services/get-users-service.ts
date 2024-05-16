import { RequestWithQuery } from '../types/request-types';
import { GetUserListSchema, GetUserSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { usersCollection } from '../db';
import { getPageCount } from '../utils/helpers';
import { databaseSearchRepository } from '../repositories/database-search-repository';
import { queryRepository } from '../repositories/queryRepository';
import { GetUsersQuery, UserDbType } from '../types/users-types';

export const getUsersService = async (req: RequestWithQuery<GetUsersQuery>) => {
  const filters = databaseSearchRepository.getUsers(req);

  const userList = await queryRepository.findAndMapUsers<UserDbType, GetUserSchema>(usersCollection, filters);

  const totalCount = await mongoDBRepository.getTotalCount(usersCollection, filters.query);

  const users: GetUserListSchema = {
    pagesCount: getPageCount(totalCount, filters.pageSize),
    page: filters.page,
    pageSize: filters.pageSize,
    totalCount,
    items: userList || [],
  };

  return users;
};
