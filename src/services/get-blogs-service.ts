import { RequestWithQuery } from '../types/request-types';
import { GetBlogSchema } from '../models';
import { mongoDB } from '../repositories/db-repository';
import { BlogDbType, GetBlogsQuery } from '../types/blog-types';
import { blogsCollection } from '../db';
import { mapIdFieldInArray } from '../utils/helpers';
import { WithId } from 'mongodb';
import { databaseSearchRepository } from '../repositories/database-search-repository';

export const getBlogsService = async (req: RequestWithQuery<GetBlogsQuery>) => {
  const settings = databaseSearchRepository.getBlogs(req);

  const blogs = await mongoDB.get<BlogDbType>(blogsCollection, settings);

  return mapIdFieldInArray<GetBlogSchema, WithId<BlogDbType>>(blogs);
};