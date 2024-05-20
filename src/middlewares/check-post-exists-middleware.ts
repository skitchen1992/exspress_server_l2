import { body } from 'express-validator';
import { mongoDBRepository } from '../repositories/db-repository';
import { postsCollection } from '../db';
import { param } from 'express-validator/src/middlewares/validation-chain-builders';
import { PostDbType } from '../types/post-types';

export const checkPostExistsMiddleware = {
  body: (fields?: string | string[]) => {
    return body(fields).custom(async (value) => {
      const post = await mongoDBRepository.getById<PostDbType>(postsCollection, value);

      if (!post?._id) {
        throw new Error('Post is not founded');
      }
    });
  },
  urlParams: (fields?: string | string[]) => {
    return param(fields).custom(async (value) => {
      const post = await mongoDBRepository.getById<PostDbType>(postsCollection, value);

      if (!post?._id) {
        throw new Error('Post is not founded');
      }
    });
  },
};
