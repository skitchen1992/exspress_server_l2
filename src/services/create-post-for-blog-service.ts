import { RequestWithParamsAndBody } from '../types/request-types';
import { GetPostSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { BlogDbType } from '../types/blog-types';
import { blogsCollection, postsCollection } from '../db';
import { PostDbType } from '../types/post-types';
import { CreatePostForBlogSchema } from '../models/posts/CreatePostForBlogSchema';
import { queryRepository } from '../repositories/queryRepository';

export const createPostForBlogService = async (
  req: RequestWithParamsAndBody<CreatePostForBlogSchema, { blogId: string }>
) => {
  const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, req.params.blogId);

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
