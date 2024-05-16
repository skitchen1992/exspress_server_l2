import { RequestWithQuery } from '../types/request-types';
import { GetPostListSchema, GetPostSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { postsCollection } from '../db';
import { getPageCount } from '../utils/helpers';
import { GetPostsQuery, PostDbType } from '../types/post-types';
import { databaseSearchRepository } from '../repositories/database-search-repository';
import { queryRepository } from '../repositories/queryRepository';

export const getPostsService = async (req: RequestWithQuery<GetPostsQuery>) => {
  const filters = databaseSearchRepository.getPosts(req);

  const postList = await queryRepository.findEntitiesAndMapIdFieldInArray<PostDbType, GetPostSchema>(
    postsCollection,
    filters
  );

  const totalCount = await mongoDBRepository.getTotalCount(postsCollection, filters.query);

  const posts: GetPostListSchema = {
    pagesCount: getPageCount(totalCount, filters.pageSize),
    page: filters.page,
    pageSize: filters.pageSize,
    totalCount,
    items: postList || [],
  };

  return posts;
};
