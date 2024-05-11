import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { GetBlogListSchema, GetBlogSchema } from '../../models';
import { blogsCollection } from '../../db';
import { mongoDB } from '../../repositories/db-repository';
import { BlogDbType } from '../../types/blog_types';
import { mapIdFieldInArray } from '../../utils/helpers';
import { WithId } from 'mongodb';

export const getBlogsController = async (req: Request, res: Response<GetBlogListSchema>) => {
  try {
    const blogs = await mongoDB.get<BlogDbType>(blogsCollection);

    const mapBlogs = mapIdFieldInArray<GetBlogSchema, WithId<BlogDbType>>(blogs);

    res.status(HTTP_STATUSES.OK_200).json(mapBlogs);
  } catch (e) {
    console.log(e);
  }
};
