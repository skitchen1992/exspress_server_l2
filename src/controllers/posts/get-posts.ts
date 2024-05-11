import { Request, Response } from 'express';
import { GetPostListSchema, GetPostSchema } from '../../models';
import { HTTP_STATUSES } from '../../utils/consts';
import { mongoDB } from '../../repositories/db-repository';
import { postsCollection } from '../../db';
import { PostDbType } from '../../types/post-types';
import { mapIdFieldInArray } from '../../utils/helpers';
import { WithId } from 'mongodb';

export const getPostsController = async (req: Request, res: Response<GetPostListSchema>) => {
  try {
    const posts = await mongoDB.get<PostDbType>(postsCollection);
    const mapPosts = mapIdFieldInArray<GetPostSchema, WithId<PostDbType>>(posts);

    res.status(HTTP_STATUSES.OK_200).json(mapPosts);
  } catch (e) {
    console.log(e);
  }
};
