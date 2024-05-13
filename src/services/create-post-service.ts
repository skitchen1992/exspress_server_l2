import { RequestWithBody } from '../types/request-types';
import { CreatePostSchema, GetPostSchema } from '../models';
import { mongoDB } from '../repositories/db-repository';
import { BlogDbType } from '../types/blog-types';
import { blogsCollection, postsCollection } from '../db';
import { PostDbType } from '../types/post-types';
import { mapIdField } from '../utils/helpers';

export const createPostService = async (req: RequestWithBody<CreatePostSchema>) => {
  const blog = await mongoDB.getById<BlogDbType>(blogsCollection, req.body.blogId);

  const newPost: PostDbType = {
    ...req.body,
    blogName: blog!.name,
    blogId: blog!._id.toString(),
    createdAt: new Date().toISOString(),
  };

  const result = await mongoDB.add<PostDbType>(postsCollection, newPost);
  const post = await mongoDB.getById<PostDbType>(postsCollection, result.insertedId.toString());

  if (result.acknowledged && post) {
    return mapIdField<GetPostSchema>(post);
  } else {
    return undefined;
  }
};
