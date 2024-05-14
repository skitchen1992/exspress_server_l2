import { RequestWithQuery, RequestWithQueryAndParams } from '../types/request-types';
import { GetBlogsQuery } from '../types/blog-types';
import { GetPostsQuery } from '../types/post-types';
import { mongoDB } from './db-repository';
import { blogsCollection, postsCollection } from '../db';

export const databaseSearchRepository = {
  getBlogs: (req: RequestWithQuery<GetBlogsQuery>) => {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = req.query;

    let query: any = {};
    if (searchNameTerm) {
      query.name = { $regex: searchNameTerm };
      //query.name = { $regex: new RegExp(`.*${searchNameTerm}.*`, 'i') };
    }

    let sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortDirection || 'desc';
    } else {
      sort.createdAt = sortDirection || 'desc';
    }

    const defaultPageNumber = Number(pageNumber) || 1;
    const defaultPageSize = Number(pageSize) || 10;

    const skip = (defaultPageNumber - 1) * defaultPageSize;

    return { query, sort, skip, pageSize: defaultPageSize, page: defaultPageNumber };
  },

  getPosts: (req: RequestWithQueryAndParams<GetPostsQuery, { blogId?: string }>) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = req.query;
    const { blogId } = req.params;

    let query: any = {};
    if (blogId) {
      query.blogId = blogId;
    }

    let sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortDirection || 'desc';
    } else {
      sort.createdAt = sortDirection || 'desc';
    }

    const defaultPageNumber = Number(pageNumber) || 1;
    const defaultPageSize = Number(pageSize) || 10;

    const skip = (defaultPageNumber - 1) * defaultPageSize;

    return { query, sort, skip, pageSize: defaultPageSize, page: defaultPageNumber };
  },
};
