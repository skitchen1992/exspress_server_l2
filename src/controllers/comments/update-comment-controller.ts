import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { RequestWithParamsAndBody } from '../../types/request-types';
import { mongoDBRepository } from '../../repositories/db-repository';
import { commentsCollection } from '../../db';
import { UpdateCommentSchema } from '../../models/comments/UpdateCommentSchema';
import { CommentDbType } from '../../types/comments-types';

type RequestType = RequestWithParamsAndBody<UpdateCommentSchema, { id: string }>;

export const updateCommentController = async (req: RequestType, res: Response) => {
  try {
    const updateResult = await mongoDBRepository.update<CommentDbType>(commentsCollection, req.params.id, req.body);

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
