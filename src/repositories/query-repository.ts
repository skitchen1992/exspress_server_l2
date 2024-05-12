import { RequestWithQuery } from '../types/request-types';
import { GetBlogsQuery } from '../types/blog-types';
import { GetPostsQuery } from '../types/post-types';

export const queryParamsRepository = {
  getBlogs: (req: RequestWithQuery<GetBlogsQuery>) => {
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

    return { query, sort, skip, pageSize: defaultPageSize };
  },

  getPosts: (req: RequestWithQuery<GetPostsQuery>) => {
    const { sortBy, sortDirection, pageNumber, pageSize } = req.query;

    let sort: any = {};
    if (sortBy) {
      sort[sortBy] = sortDirection || 'desc';
    }

    const defaultPageNumber = Number(pageNumber) || 1;
    const defaultPageSize = Number(pageSize) || 10;

    const skip = (defaultPageNumber - 1) * defaultPageSize;

    return { sort, skip, pageSize: defaultPageSize };
  },
};
