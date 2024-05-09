import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { UpdateBlogSchema } from '../../models';
import { RequestWithParamsAndBody } from '../../types/request-types';
import { mongoDB } from '../../db/database';
import { blogsCollection } from '../../db';

type RequestType = RequestWithParamsAndBody<UpdateBlogSchema, { id: string }>;

export const putBlogController = async (req: RequestType, res: Response) => {
  try {
    const updateResult = await mongoDB.update<UpdateBlogSchema>(blogsCollection, req.params.id, req.body);

    if (updateResult.modifiedCount === 1) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};
