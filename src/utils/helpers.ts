import { GetBlogsQuery } from '../types/blog-types';
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, DEFAULT_SORT } from './consts';
import { GetPostsQuery } from '../types/post-types';
import { GetUsersQuery } from '../types/users-types';
import { compare, genSalt, hash } from 'bcryptjs';
import { ObjectId } from 'mongodb';

export const getPageCount = (totalCount: number, pageSize: number) => {
  return Math.ceil(totalCount / pageSize);
};

export const getCurrentDate = () => {
  return new Date().toISOString();
};

export const isValidObjectId = (id: string): boolean => {
  return ObjectId.isValid(id);
};

export const searchQueryBuilder = {
  getBlogs: (queryParams: GetBlogsQuery) => {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } = queryParams;

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

  getPosts: (queryParams: GetPostsQuery, params: { blogId?: string }) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = queryParams;
    const { blogId } = params;

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

  getComments: (queryParams: GetPostsQuery, params: { postId?: string }) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = queryParams;
    const { postId } = params;

    let query: any = {};
    if (postId) {
      query.postId = postId;
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

  getUsers: (queryParams: GetUsersQuery) => {
    const { sortBy, sortDirection, pageNumber, pageSize, searchLoginTerm, searchEmailTerm } = queryParams;

    let query: any = {};
    if (searchLoginTerm && searchEmailTerm) {
      query.$or = [
        { login: { $regex: new RegExp(`.*${searchLoginTerm}.*`, 'i') } },
        { email: { $regex: new RegExp(`.*${searchEmailTerm}.*`, 'i') } },
      ];
    } else {
      if (searchLoginTerm) {
        query.login = { $regex: new RegExp(`.*${searchLoginTerm}.*`, 'i') };
      }
      if (searchEmailTerm) {
        query.email = { $regex: new RegExp(`.*${searchEmailTerm}.*`, 'i') };
      }
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

export const passwordBuilder = {
  hashPassword: async (password: string, saltRounds = 10) => {
    const salt = await genSalt(saltRounds);
    return await hash(password, salt);
  },
  comparePasswords: async (password: string, hashedPassword: string) => {
    return await compare(password, hashedPassword);
  },
};
