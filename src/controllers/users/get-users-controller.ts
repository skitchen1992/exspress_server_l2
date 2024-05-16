import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { GetUserListSchema } from '../../models';
import { RequestWithQuery } from '../../types/request-types';
import { GetUsersQuery } from '../../types/users-types';
import { getUsersService } from '../../services/get-users-service';

export const getUsersController = async (req: RequestWithQuery<GetUsersQuery>, res: Response<GetUserListSchema>) => {
  try {
    const users = await getUsersService(req);

    res.status(HTTP_STATUSES.OK_200).json(users);
  } catch (e) {
    console.log(e);
  }
};
