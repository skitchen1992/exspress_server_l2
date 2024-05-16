import { RequestWithQuery } from '../types/request-types';
import { GetBlogListSchema, GetBlogSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { BlogDbType, GetBlogsQuery } from '../types/blog-types';
import { blogsCollection } from '../db';
import { getPageCount } from '../utils/helpers';
import { databaseSearchRepository } from '../repositories/database-search-repository';
import { queryRepository } from '../repositories/queryRepository';

export const getBlogsService = async (req: RequestWithQuery<GetBlogsQuery>) => {
  const filters = databaseSearchRepository.getBlogs(req);

  const blogList = await queryRepository.findEntitiesAndMapIdFieldInArray<BlogDbType, GetBlogSchema>(
    blogsCollection,
    filters
  );

  const totalCount = await mongoDBRepository.getTotalCount(blogsCollection, filters.query);

  const blogs: GetBlogListSchema = {
    pagesCount: getPageCount(totalCount, filters.pageSize),
    page: filters.page,
    pageSize: filters.pageSize,
    totalCount,
    items: blogList || [],
  };

  return blogs;
};
