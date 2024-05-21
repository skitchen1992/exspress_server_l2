import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { GetBlogListSchema, GetBlogSchema } from '../../models';
import { RequestWithQuery } from '../../types/request-types';
import { BlogDbType, GetBlogsQuery } from '../../types/blog-types';
import { getPageCount, searchQueryBuilder } from '../../utils/helpers';
import { queryRepository } from '../../repositories/queryRepository';
import { blogsCollection } from '../../db';

export const getBlogsController = async (req: RequestWithQuery<GetBlogsQuery>, res: Response<GetBlogListSchema>) => {
  try {
    const filters = searchQueryBuilder.getBlogs(req.query);

    const { entities: blogList, totalCount } = await queryRepository.findEntitiesAndMapIdFieldInArray<
      BlogDbType,
      GetBlogSchema
    >(blogsCollection, filters);

    const blogs: GetBlogListSchema = {
      pagesCount: getPageCount(totalCount, filters.pageSize),
      page: filters.page,
      pageSize: filters.pageSize,
      totalCount,
      items: blogList,
    };

    res.status(HTTP_STATUSES.OK_200).json(blogs);
  } catch (e) {
    console.log(e);
  }
};
