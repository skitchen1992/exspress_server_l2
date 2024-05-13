import { RequestWithBody } from '../types/request-types';
import { CreateBlogSchema, CreatePostSchema, GetBlogSchema, GetPostSchema } from '../models';
import { mongoDB } from '../repositories/db-repository';
import { BlogDbType } from '../types/blog-types';
import { blogsCollection, postsCollection } from '../db';
import { PostDbType } from '../types/post-types';
import { mapIdField } from '../utils/helpers';

export const createBlogService = async (req: RequestWithBody<CreateBlogSchema>) => {
  const newBlog: BlogDbType = {
    ...req.body,
    createdAt: new Date().toISOString(),
    isMembership: false,
  };

  const result = await mongoDB.add<BlogDbType>(blogsCollection, newBlog);
  const blog = await mongoDB.getById<BlogDbType>(blogsCollection, result.insertedId.toString());

  if (result.acknowledged && blog) {
    return mapIdField<GetBlogSchema>(blog);
  } else {
    return undefined;
  }
};
