import { GetPostSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { BlogDbType } from '../types/blog-types';
import { blogsCollection, postsCollection } from '../db';
import { PostDbType } from '../types/post-types';
import { CreatePostForBlogSchema } from '../models/posts/CreatePostForBlogSchema';
import { queryRepository } from '../repositories/queryRepository';
import { getCurrentDate } from '../utils/helpers';

export const createPostForBlogService = async (body: CreatePostForBlogSchema, params: { blogId: string }) => {
  const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, params.blogId);

  if (!blog) {
    return null;
  }

  const newPost: PostDbType = {
    title: body.title,
    shortDescription: body.shortDescription,
    content: body.content,
    blogName: blog.name,
    blogId: blog._id.toString(),
    createdAt: getCurrentDate(),
  };

  const { insertedId } = await mongoDBRepository.add<PostDbType>(postsCollection, newPost);

  const post = await queryRepository.findEntityAndMapIdField<PostDbType, GetPostSchema>(
    postsCollection,
    insertedId.toString()
  );

  if (post) {
    return post;
  } else {
    return null;
  }
};
