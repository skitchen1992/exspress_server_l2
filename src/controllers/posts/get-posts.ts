import { Request, Response } from 'express';
import { GetPostListSchema } from '../../models';
import { HTTP_STATUSES } from '../../utils/consts';
import { getPostsService } from '../../services/get-posts-service';

export const getPostsController = async (req: Request, res: Response<GetPostListSchema>) => {
  try {
    const posts = await getPostsService(req);
    //@ts-ignore
    res.status(HTTP_STATUSES.OK_200).json(posts);
  } catch (e) {
    console.log(e);
  }
};
