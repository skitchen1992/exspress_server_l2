import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { RequestWithPrams } from '../../types/request-types';
import { mongoDB } from '../../db/database';
import { UpdateBlogSchema } from '../../models';
import { blogsCollection } from '../../db';

type RequestType = RequestWithPrams<{ id: string }>;

export const deleteBlogController = async (req: RequestType, res: Response) => {
  try {
    const deleteResult = await mongoDB.delete<UpdateBlogSchema>(blogsCollection, req.params.id);

    if (deleteResult.deletedCount === 1) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};
