import { CreatePostSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { BlogDbType } from '../types/blog-types';
import { postsCollection } from '../db';
import { PostDbType } from '../types/post-types';
import { getCurrentDate } from '../utils/helpers';
import { WithId } from 'mongodb';

export const createPostService = async (body: CreatePostSchema, blog: WithId<BlogDbType>) => {
  const newPost: PostDbType = {
    title: body.title,
    shortDescription: body.shortDescription,
    content: body.content,
    blogName: blog.name,
    blogId: blog._id.toString(),
    createdAt: getCurrentDate(),
  };

  const { insertedId } = await mongoDBRepository.add<PostDbType>(postsCollection, newPost);

  return insertedId;
};
