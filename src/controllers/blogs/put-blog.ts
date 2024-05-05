import { db } from '../../db/db';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { UpdateBlogSchema } from '../../models';
import { RequestWithPramsAndBody } from '../../types/request-types';

type RequestType = RequestWithPramsAndBody<UpdateBlogSchema, { id: string }>

export const putBlogController = async (req: RequestType, res: Response) => {
  try {
    const isUpdated = await db.updateBlog(req.params.id, req.body);

    if (isUpdated) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};

