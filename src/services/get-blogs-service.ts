import { RequestWithQuery } from '../types/request-types';
import { GetBlogSchema } from '../models';
import { mongoDB } from '../repositories/db-repository';
import { BlogDbType, GetBlogsQuery } from '../types/blog-types';
import { blogsCollection } from '../db';
import { mapIdFieldInArray } from '../utils/helpers';
import { WithId } from 'mongodb';

export const getBlogsService = async (req: RequestWithQuery<GetBlogsQuery>) => {
  const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = req.query;

  let query: any = {};
  if (searchNameTerm) {
    query.name = { $regex: searchNameTerm, $options: 'i' };
  }

  let sort: any = {};
  if (sortBy) {
    sort[sortBy] = sortDirection || 'desc';
  }

  const defaultPageNumber = Number(pageNumber) || 1;
  const defaultPageSize = Number(pageSize) || 10;

  const skip = (defaultPageNumber - 1) * defaultPageSize;

  const blogs = await mongoDB.get<BlogDbType>(blogsCollection, { query, sort, skip, pageSize: defaultPageSize });

  return mapIdFieldInArray<GetBlogSchema, WithId<BlogDbType>>(blogs);
};
