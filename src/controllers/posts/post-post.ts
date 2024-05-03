import { db } from '../../db/db';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import {
  PostPostsSchema,
  PostPostsSchemaResponse,
  ResponseErrorSchema,
} from '../../models';

import { RequestWithBody } from '../../types/request-types';

type ResponseType = PostPostsSchemaResponse | ResponseErrorSchema

export const postPostController = async (req: RequestWithBody<PostPostsSchema>, res: Response<ResponseType>) => {
  try {
    const id = await db.addPost(req.body);

    const post = await db.getPostById(id);

    if (post) {
      res.status(HTTP_STATUSES.CREATED_201).json(post);
    } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Not found',
            field: `Post ID: ${id}`,
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};

