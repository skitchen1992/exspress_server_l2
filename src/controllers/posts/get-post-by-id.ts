import { db } from '../../db/db';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreatePostSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestWithPrams } from '../../types/request-types';

type ResponseType = CreatePostSchemaResponse | ResponseErrorSchema;

export const getPostByIdController = async (req: RequestWithPrams<{ id: string }>, res: Response<ResponseType>) => {
  try {
    const id = req.params.id;
    const post = await db.getPostById(id);

    if (post) {
      res.status(HTTP_STATUSES.OK_200).json(post);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};
