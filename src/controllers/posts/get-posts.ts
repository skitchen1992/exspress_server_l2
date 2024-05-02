import { Request, Response } from 'express';
import { GetPostsListSchema } from '../../models';
import { db } from '../../db/db';
import { HTTP_STATUSES } from '../../utils/consts';

export const getPostsController = async (req: Request, res: Response<GetPostsListSchema>) => {
  try {
    const blogs = await db.getPosts();

    res.status(HTTP_STATUSES.OK_200).json(blogs);
  } catch (e) {
    console.log(e);
  }
};
