import { getPageCount, searchQueryBuilder } from '../utils/helpers';
import { BlogDbType, GetBlogsQuery } from '../types/blog-types';
import {
  GetBlogListSchema,
  GetBlogSchema,
  GetCommentListSchema,
  GetPostListSchema,
  GetPostSchema,
  GetUserListSchema,
  GetUserSchema,
} from '../models';
import { blogsCollection, commentsCollection, postsCollection, usersCollection } from '../db/collection';
import { mapperRepository } from './mapperRepository';
import { Result, ResultStatus } from '../types/common/result';
import { GetPostsQuery, PostDbType } from '../types/post-types';
import { CommentDbType, GetCommentsQuery } from '../types/comments-types';
import { GetCommentSchema } from '../models/comments/GetCommentSchema';
import { GetUsersQuery, UserDbType } from '../types/users-types';
import { mongoDBRepository } from './db-repository';

class QueryRepository {
  public async getBlogById(id: string) {
    const blog = await mapperRepository.findEntityAndMapIdField<BlogDbType, GetBlogSchema>(blogsCollection, id);

    return { data: blog, status: blog ? ResultStatus.Success : ResultStatus.NotFound };
  }
  public async getBlogs(query: GetBlogsQuery): Promise<Result<GetBlogListSchema>> {
    const filters = searchQueryBuilder.getBlogs(query);

    const { entities: blogList, totalCount } = await mapperRepository.findEntitiesAndMapIdFieldInArray<
      BlogDbType,
      GetBlogSchema
    >(blogsCollection, filters);

    const blogs: GetBlogListSchema = {
      pagesCount: getPageCount(totalCount, filters.pageSize),
      page: filters.page,
      pageSize: filters.pageSize,
      totalCount,
      items: blogList,
    };

    return { data: blogs, status: ResultStatus.Success };
  }

  public async getPostById(id: string) {
    const post = await mapperRepository.findEntityAndMapIdField<PostDbType, GetPostSchema>(postsCollection, id);
    return { data: post, status: post ? ResultStatus.Success : ResultStatus.NotFound };
  }

  public async getPosts(query: GetPostsQuery, params?: { blogId: string }) {
    const filters = searchQueryBuilder.getPosts(query, params);

    const { entities: postList, totalCount } = await mapperRepository.findEntitiesAndMapIdFieldInArray<
      PostDbType,
      GetPostSchema
    >(postsCollection, filters);

    const posts: GetPostListSchema = {
      pagesCount: getPageCount(totalCount, filters.pageSize),
      page: filters.page,
      pageSize: filters.pageSize,
      totalCount,
      items: postList,
    };

    return { data: posts, status: ResultStatus.Success };
  }

  public async getCommentById(id: string) {
    const comment = await mapperRepository.findEntityAndMapIdField<CommentDbType, GetCommentSchema>(
      commentsCollection,
      id,
      ['postId']
    );
    return { data: comment, status: comment ? ResultStatus.Success : ResultStatus.NotFound };
  }

  public async getComments(query: GetCommentsQuery, params?: { postId: string }) {
    const filters = searchQueryBuilder.getComments(query, params);

    const { entities: commentList, totalCount } = await mapperRepository.findEntitiesAndMapIdFieldInArray<
      CommentDbType,
      GetCommentSchema
    >(commentsCollection, filters, ['postId']);

    const comments: GetCommentListSchema = {
      pagesCount: getPageCount(totalCount, filters.pageSize),
      page: filters.page,
      pageSize: filters.pageSize,
      totalCount,
      items: commentList,
    };

    return { data: comments, status: ResultStatus.Success };
  }

  public async getUserById(id: string) {
    const user = await mapperRepository.findEntityAndMapIdField<UserDbType, GetUserSchema>(usersCollection, id, [
      'password',
    ]);
    return { data: user, status: user ? ResultStatus.Success : ResultStatus.NotFound };
  }

  public async getUsers(query: GetUsersQuery) {
    const filters = searchQueryBuilder.getUsers(query);

    const { entities: userList, totalCount } = await mapperRepository.findEntitiesAndMapIdFieldInArray<
      UserDbType,
      GetUserSchema
    >(usersCollection, filters, ['password']);

    const users: GetUserListSchema = {
      pagesCount: getPageCount(totalCount, filters.pageSize),
      page: filters.page,
      pageSize: filters.pageSize,
      totalCount,
      items: userList,
    };

    return { data: users, status: ResultStatus.Success };
  }

  public async isExistsUser(login: string, email: string): Promise<Result> {
    const hasUserByLogin = await mongoDBRepository.getByField<UserDbType>(usersCollection, ['login'], login);
    const hasUserByEmail = await mongoDBRepository.getByField<UserDbType>(usersCollection, ['email'], email);

    if (hasUserByLogin || hasUserByEmail) {
      return {
        data: null,
        status: ResultStatus.BagRequest,
      };
    } else {
      return {
        data: null,
        status: ResultStatus.Success,
      };
    }
  }
}

export const queryRepository = new QueryRepository();
