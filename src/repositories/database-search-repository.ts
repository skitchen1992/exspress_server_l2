import { RequestWithQuery, RequestWithQueryAndParams } from '../types/request-types';
import { GetBlogsQuery } from '../types/blog-types';
import { GetPostsQuery } from '../types/post-types';

export const databaseSearchRepository = {
  getBlogs: (req: RequestWithQuery<GetBlogsQuery>) => {
    const { searchNameTerm, sortBy = 'createdAt', sortDirection, pageNumber, pageSize } = req.query;

    let query: any = {};
    if (searchNameTerm) {
      //query.name = { $regex: searchNameTerm, $options: 'i' };
      query.name = { $regex: new RegExp(`.*${searchNameTerm}.*`, 'i') };
    }

    let sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortDirection || 'desc';
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
    }

    const defaultPageNumber = Number(pageNumber) || 1;
    const defaultPageSize = Number(pageSize) || 10;

    const skip = (defaultPageNumber - 1) * defaultPageSize;

    return { query, sort, skip, pageSize: defaultPageSize, page: defaultPageNumber };
  },
};
