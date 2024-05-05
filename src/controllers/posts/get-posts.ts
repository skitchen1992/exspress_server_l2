import { Request, Response } from 'express';
import { GetPostListSchema } from '../../models';
import { db } from '../../db/db';
import { HTTP_STATUSES } from '../../utils/consts';

export const getPostsController = async (req: Request, res: Response<GetPostListSchema>) => {
  try {
    const blogs = await db.getPosts();

    res.status(HTTP_STATUSES.OK_200).json(blogs);
  } catch (e) {
    console.log(e);
  }
};
