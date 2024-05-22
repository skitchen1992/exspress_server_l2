import { Response } from 'express';
import { GetPostListSchema, GetPostSchema } from '../../models';
import { HTTP_STATUSES } from '../../utils/consts';
import { RequestWithQuery } from '../../types/request-types';
import { GetPostsQuery, PostDbType } from '../../types/post-types';
import { getPageCount, searchQueryBuilder } from '../../utils/helpers';
import { queryRepository } from '../../repositories/queryRepository';
import { postsCollection } from '../../db';

export const getPostsController = async (req: RequestWithQuery<GetPostsQuery>, res: Response<GetPostListSchema>) => {
  try {
    const filters = searchQueryBuilder.getPosts(req.query, {});

    const { entities: postList, totalCount } = await queryRepository.findEntitiesAndMapIdFieldInArray<
      PostDbType,
      GetPostSchema
    >(postsCollection, filters);

    const posts: GetPostListSchema = {
      pagesCount: getPageCount(totalCount, filters.pageSize),
      page: filters.page,
      pageSize: filters.pageSize,
      totalCount,
      items: postList,
    };

    res.status(HTTP_STATUSES.OK_200).json(posts);
  } catch (e) {
    console.log(e);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
