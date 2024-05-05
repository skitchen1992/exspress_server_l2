import { db } from '../../db/db';
import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { GetBlogListSchema } from '../../models';

export const getBlogsController = async (req: Request, res: Response<GetBlogListSchema>) => {
  try {
    const blogs = await db.getBlogs();

    res.status(HTTP_STATUSES.OK_200).json(blogs);
  } catch (e) {
    console.log(e);
  }
};
