import { RequestWithQuery, RequestWithQueryAndParams } from '../types/request-types';
import { GetBlogsQuery } from '../types/blog-types';
import { GetPostsQuery } from '../types/post-types';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, DEFAULT_SORT } from '../utils/consts';
import { GetUsersQuery } from '../types/users-types';

export const databaseSearchRepository = {
  getBlogs: (req: RequestWithQuery<GetBlogsQuery>) => {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = req.query;

    let query: any = {};
    if (searchNameTerm) {
      query.name = { $regex: new RegExp(`.*${searchNameTerm}.*`, 'i') };
    }

    let sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortDirection || DEFAULT_SORT;
    } else {
      sort.createdAt = sortDirection || DEFAULT_SORT;
    }

    const defaultPageNumber = Number(pageNumber) || DEFAULT_PAGE_NUMBER;
    const defaultPageSize = Number(pageSize) || DEFAULT_PAGE_SIZE;

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
      sort[sortBy] = sortDirection || DEFAULT_SORT;
    } else {
      sort.createdAt = sortDirection || DEFAULT_SORT;
    }

    const defaultPageNumber = Number(pageNumber) || DEFAULT_PAGE_NUMBER;
    const defaultPageSize = Number(pageSize) || DEFAULT_PAGE_SIZE;

    const skip = (defaultPageNumber - 1) * defaultPageSize;

    return { query, sort, skip, pageSize: defaultPageSize, page: defaultPageNumber };
  },

  getUsers: (req: RequestWithQuery<GetUsersQuery>) => {
    const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = req.query;

    let query: any = {};
    if (searchLoginTerm) {
      query.login = { $regex: new RegExp(`.*${searchLoginTerm}.*`, 'i') };
    }
    if (searchEmailTerm) {
      query.email = { $regex: new RegExp(`.*${searchEmailTerm}.*`, 'i') };
    }

    let sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortDirection || DEFAULT_SORT;
    } else {
      sort.createdAt = sortDirection || DEFAULT_SORT;
    }

    const defaultPageNumber = Number(pageNumber) || DEFAULT_PAGE_NUMBER;
    const defaultPageSize = Number(pageSize) || DEFAULT_PAGE_SIZE;

    const skip = (defaultPageNumber - 1) * defaultPageSize;

    return { query, sort, skip, pageSize: defaultPageSize, page: defaultPageNumber };
  },
};
