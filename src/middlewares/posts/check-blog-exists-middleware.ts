import { body } from 'express-validator';
import { db } from '../../db/db';

export const checkBlogExistsMiddleware = () => {
  return body('blogId').custom(async (value) => {
    const blog = await db.getBlogById(value);

    if (!Number(blog?.id)) {
      throw new Error('Blog is not founded');
    }
  });
};
