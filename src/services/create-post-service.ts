import { RequestWithBody } from '../types/request-types';
import { CreatePostSchema, GetPostSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { BlogDbType } from '../types/blog-types';
import { blogsCollection, postsCollection } from '../db';
import { PostDbType } from '../types/post-types';
import { queryRepository } from '../repositories/queryRepository';

export const createPostService = async (req: RequestWithBody<CreatePostSchema>) => {
  const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, req.body.blogId);

  if (!blog) {
    return null;
  }

  const newPost: PostDbType = {
    title: req.body.title,
    shortDescription: req.body.shortDescription,
    content: req.body.content,
    blogName: blog.name,
    blogId: blog._id.toString(),
    createdAt: new Date().toISOString(),
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
