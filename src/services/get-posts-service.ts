import { RequestWithQuery } from '../types/request-types';
import { GetPostSchema } from '../models';
import { mongoDB } from '../repositories/db-repository';
import { postsCollection } from '../db';
import { mapIdFieldInArray } from '../utils/helpers';
import { WithId } from 'mongodb';
import { GetPostsQuery, PostDbType } from '../types/post-types';
import { databaseSearchRepository } from '../repositories/database-search-repository';

export const getPostsService = async (req: RequestWithQuery<GetPostsQuery>) => {
  const settings = databaseSearchRepository.getPosts(req);

  const posts = await mongoDB.get<PostDbType>(postsCollection, settings);

  return mapIdFieldInArray<GetPostSchema, WithId<PostDbType>>(posts);
};
