import { GetBlogsQuery } from '../types/blog-types';
import { GetPostsQuery } from '../types/post-types';

export const HTTP_STATUSES = {
  OK_200: 200,
  CREATED_201: 201,
  NO_CONTENT_204: 204,
  BAD_REQUEST_400: 400,
  UNAUTHORIZED_401: 401,
  FORBIDDEN_403: 403,
  NOT_FOUND_404: 404,
  METHOD_NOT_ALLOWED_405: 405,
  INTERNAL_SERVER_ERROR_500: 500,
  BAD_GATEWAY_502: 502,
  SERVICE_UNAVAILABLE_503: 503,
  GATEWAY_TIMEOUT_504: 504,
};

export const PATH_URL = {
  ROOT: '/',
  ID: '/:id',
  BLOGS: '/blogs',
  POSTS_FOR_BLOG: '/:blogId/posts',
  POSTS: '/posts',
  TESTING: {
    ROOT: '/testing',
    ALL_DATA: '/all-data',
  },
};

type GetBlogsQueryKeys = keyof GetBlogsQuery;
export const getBlogsQueryParams: GetBlogsQueryKeys[] = [
  'searchNameTerm',
  'sortBy',
  'sortDirection',
  'pageNumber',
  'pageSize',
];

type GetPostsQueryKeys = keyof GetPostsQuery;
export const getPostsQueryParams: GetPostsQueryKeys[] = ['sortBy', 'sortDirection', 'pageNumber', 'pageSize'];

export const DEFAULT_SORT = 'desc';
export const DEFAULT_PAGE_NUMBER = 1;
export const DEFAULT_PAGE_SIZE = 10;
