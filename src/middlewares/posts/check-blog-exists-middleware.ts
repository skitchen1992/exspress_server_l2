import { body } from 'express-validator';
import { mongoDB } from '../../repositories/db-repository';
import { BlogDbType } from '../../types/blog_types';
import { blogsCollection } from '../../db';

export const checkBlogExistsMiddleware = () => {
  return body('blogId').custom(async (value) => {
    const blog = await mongoDB.getById<BlogDbType>(blogsCollection, value);

    if (!blog?._id) {
      throw new Error('Blog is not founded');
    }
  });
};
