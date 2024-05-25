import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { RequestWithParams } from '../../types/request-types';
import { commentsCollection } from '../../db/collection';
import { GetCommentSchema } from '../../models/comments/GetCommentSchema';
import { mongoDBRepository } from '../../repositories/db-repository';
import { mapIdField } from '../../utils/map';
import { CommentDbType } from '../../types/comments-types';

type ResponseType = GetCommentSchema | null;
export const getCommentByIdController = async (req: RequestWithParams<{ id: string }>, res: Response<ResponseType>) => {
  try {
    const comment = await mongoDBRepository.getById<CommentDbType>(commentsCollection, req.params.id);

    if (comment) {
      const mapComment = mapIdField<GetCommentSchema>(comment);

      res.status(HTTP_STATUSES.OK_200).json(mapComment);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
