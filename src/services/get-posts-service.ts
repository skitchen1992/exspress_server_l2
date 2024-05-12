import { RequestWithQuery } from '../types/request-types';
import { GetBlogSchema, GetPostSchema } from '../models';
import { mongoDB } from '../repositories/db-repository';
import { BlogDbType, GetBlogsQuery } from '../types/blog-types';
import { blogsCollection, postsCollection } from '../db';
import { mapIdFieldInArray } from '../utils/helpers';
import { WithId } from 'mongodb';
import { GetPostsQuery, PostDbType } from '../types/post-types';

export const getPostsService = async (req: RequestWithQuery<GetPostsQuery>) => {
  const { sortBy, sortDirection, pageNumber, pageSize } = req.query;

  let sort: any = {};
  if (sortBy) {
    sort[sortBy] = sortDirection || 'desc';
  }

  const defaultPageNumber = Number(pageNumber) || 1;
  const defaultPageSize = Number(pageSize) || 10;

  const skip = (defaultPageNumber - 1) * defaultPageSize;

  const posts = await mongoDB.get<PostDbType>(postsCollection, { sort, skip, pageSize: defaultPageSize });

  return mapIdFieldInArray<GetPostSchema, WithId<PostDbType>>(posts);
};
