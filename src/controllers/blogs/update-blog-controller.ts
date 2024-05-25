import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { UpdateBlogSchema } from '../../models';
import { RequestWithParamsAndBody } from '../../types/request-types';
import { mongoDBRepository } from '../../repositories/db-repository';
import { blogsCollection } from '../../db/collection';
import { BlogDbType } from '../../types/blog-types';

type RequestType = RequestWithParamsAndBody<UpdateBlogSchema, { id: string }>;

export const updateBlogController = async (req: RequestType, res: Response) => {
  try {
    const updateResult = await mongoDBRepository.update<BlogDbType>(blogsCollection, req.params.id, req.body);

    if (updateResult.modifiedCount === 1) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
