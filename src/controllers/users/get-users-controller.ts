import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { GetUserListSchema, GetUserSchema } from '../../models';
import { RequestWithQuery } from '../../types/request-types';
import { GetUsersQuery, UserDbType } from '../../types/users-types';
import { getPageCount, searchQueryBuilder } from '../../utils/helpers';
import { queryRepository } from '../../repositories/queryRepository';
import { usersCollection } from '../../db/collection';

export const getUsersController = async (req: RequestWithQuery<GetUsersQuery>, res: Response<GetUserListSchema>) => {
  try {
    const filters = searchQueryBuilder.getUsers(req.query);

    const { userList, totalCount } = await queryRepository.findAndMapUserList<UserDbType, GetUserSchema>(
      usersCollection,
      filters
    );

    const users: GetUserListSchema = {
      pagesCount: getPageCount(totalCount, filters.pageSize),
      page: filters.page,
      pageSize: filters.pageSize,
      totalCount,
      items: userList,
    };

    res.status(HTTP_STATUSES.OK_200).json(users);
  } catch (e) {
    console.log(e);
  }
};
