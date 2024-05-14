import { RequestWithQuery } from '../types/request-types';
import { GetBlogListSchema, GetBlogSchema } from '../models';
import { mongoDB } from '../repositories/db-repository';
import { BlogDbType, GetBlogsQuery } from '../types/blog-types';
import { blogsCollection } from '../db';
import { mapIdFieldInArray } from '../utils/helpers';
import { WithId } from 'mongodb';
import { databaseSearchRepository } from '../repositories/database-search-repository';

export const getBlogsService = async (req: RequestWithQuery<GetBlogsQuery>) => {
  const filters = databaseSearchRepository.getBlogs(req);

  const blogsFromDb = await mongoDB.get<BlogDbType>(blogsCollection, filters);

  const totalCount = await mongoDB.getTotalCount(blogsCollection);

  const blogs: GetBlogListSchema = {
    pagesCount: Math.ceil(totalCount / filters.pageSize),
    page: filters.page,
    pageSize: filters.pageSize,
    totalCount,
    items: mapIdFieldInArray<GetBlogSchema, WithId<BlogDbType>>(blogsFromDb),
  };

  return blogs;
};
