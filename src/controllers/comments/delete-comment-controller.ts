import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { RequestWithParams } from '../../types/request-types';
import { mongoDBRepository } from '../../repositories/db-repository';
import { commentsCollection } from '../../db/collection';
import { CommentDbType } from '../../types/comments-types';

type RequestType = RequestWithParams<{ commentId: string }>;

export const deleteCommentController = async (req: RequestType, res: Response) => {
  try {
    const currentUserId = res.locals.user?.id.toString();

    const comment = await mongoDBRepository.getById<CommentDbType>(commentsCollection, req.params.commentId);

    if (!comment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    if (currentUserId !== comment?.commentatorInfo.userId.toString()) {
      res.sendStatus(HTTP_STATUSES.FORBIDDEN_403);
      return;
    }

    const deleteResult = await mongoDBRepository.delete(commentsCollection, req.params.commentId);

    if (deleteResult.deletedCount === 1) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};

// export const deleteCommentController = async (req: RequestType, res: Response) => {
//   try {
//     const deleteResult = await mongoDBRepository.delete(commentsCollection, req.params.commentId);
//
//     if (deleteResult.deletedCount === 1) {
//       res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
//     } else {
//       res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
//     }
//   } catch (e) {
//     console.log(e);
//   }
// };
