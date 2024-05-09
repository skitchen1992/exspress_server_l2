import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { UpdatePostSchema } from '../../models';
import { RequestWithParamsAndBody } from '../../types/request-types';
import { mongoDB } from '../../db/database';
import { postsCollection } from '../../db';

type RequestType = RequestWithParamsAndBody<UpdatePostSchema, { id: string }>;

export const putPostController = async (req: RequestType, res: Response) => {
  try {
    const updateResult = await mongoDB.update(postsCollection, req.params.id, req.body);

    if (updateResult.modifiedCount === 1) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};
