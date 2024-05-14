import { RequestWithQuery } from '../types/request-types';
import { GetPostListSchema, GetPostSchema } from '../models';
import { mongoDB } from '../repositories/db-repository';
import { postsCollection } from '../db';
import { getPageCount, mapIdFieldInArray } from '../utils/helpers';
import { WithId } from 'mongodb';
import { GetPostsQuery, PostDbType } from '../types/post-types';
import { databaseSearchRepository } from '../repositories/database-search-repository';

export const getPostsService = async (req: RequestWithQuery<GetPostsQuery>) => {
  const filters = databaseSearchRepository.getPosts(req);

  const postsFromDb = await mongoDB.get<PostDbType>(postsCollection, filters);

  const totalCount = await mongoDB.getTotalCount(postsCollection, filters.query);

  const posts: GetPostListSchema = {
    pagesCount: getPageCount(totalCount, filters.pageSize),
    page: filters.page,
    pageSize: filters.pageSize,
    totalCount,
    items: mapIdFieldInArray<GetPostSchema, WithId<PostDbType>>(postsFromDb),
  };

  return posts;
};
