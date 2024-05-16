import { body } from 'express-validator';
import { mongoDBRepository } from '../repositories/db-repository';
import { BlogDbType } from '../types/blog-types';
import { blogsCollection } from '../db';
import { param } from 'express-validator/src/middlewares/validation-chain-builders';

export const checkBlogExistsMiddleware = {
  body: (fields?: string | string[]) => {
    return body(fields).custom(async (value) => {
      const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, value);

      if (!blog?._id) {
        throw new Error('Blog is not founded');
      }
    });
  },
  urlParams: (fields?: string | string[]) => {
    return param(fields).custom(async (value) => {
      const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, value);

      if (!blog?._id) {
        throw new Error('Blog is not founded');
      }
    });
  },
};
