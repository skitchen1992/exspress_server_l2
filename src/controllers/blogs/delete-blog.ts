import { db } from '../../db/db';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { RequestWithPrams } from '../../types/request-types';

type RequestType = RequestWithPrams<{ id: string }>;

export const deleteBlogController = async (req: RequestType, res: Response) => {
  try {
    const isDelete = await db.deleteBlog(req.params.id);

    if (isDelete) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};
