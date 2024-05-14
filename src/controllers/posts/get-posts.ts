import { Response } from 'express';
import { GetPostListSchema } from '../../models';
import { HTTP_STATUSES } from '../../utils/consts';
import { getPostsService } from '../../services/get-posts-service';
import { RequestWithQuery } from '../../types/request-types';
import { GetPostsQuery } from '../../types/post-types';

export const getPostsController = async (req: RequestWithQuery<GetPostsQuery>, res: Response<GetPostListSchema>) => {
  try {
    const posts = await getPostsService(req);

    res.status(HTTP_STATUSES.OK_200).json(posts);
  } catch (e) {
    console.log(e);
  }
};
