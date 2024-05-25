import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { RequestWithParams } from '../../types/request-types';
import { commentsCollection } from '../../db/collection';
import { GetCommentSchema } from '../../models/comments/GetCommentSchema';
import { CommentDbType } from '../../types/comments-types';
import { queryRepository } from '../../repositories/queryRepository';

type ResponseType = GetCommentSchema | null;

export const getCommentByIdController = async (req: RequestWithParams<{ id: string }>, res: Response<ResponseType>) => {
  try {
    const comment = await queryRepository.findEntityAndMapIdField<CommentDbType, GetCommentSchema>(
      commentsCollection,
      req.params.id,
      ['postId']
    );
    if (comment) {
      res.status(HTTP_STATUSES.OK_200).json(comment);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
