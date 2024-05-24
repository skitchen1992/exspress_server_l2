import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreateCommentSchema, ResponseErrorSchema } from '../../models';
import { RequestWithParamsAndBody } from '../../types/request-types';
import { CreateCommentSchemaResponse } from '../../models/comments/CreateCommentSchemaResponse';
import { createCommentService } from '../../services/create-comment-service';
import { isValidObjectId } from '../../utils/helpers';
import { ErrorMessageSchema } from '../../models/errors/ErrorMessageSchema';
import { mongoDBRepository } from '../../repositories/db-repository';
import { PostDbType } from '../../types/post-types';
import { commentsCollection, postsCollection } from '../../db/collection';
import { queryRepository } from '../../repositories/queryRepository';
import { CommentDbType } from '../../types/comments-types';
import { GetCommentSchema } from '../../models/comments/GetCommentSchema';

type ResponseType = CreateCommentSchemaResponse | ResponseErrorSchema;

export const createCommentController = async (
  req: RequestWithParamsAndBody<CreateCommentSchema, { postId: string }>,
  res: Response<ResponseType>
) => {
  try {
    const isValid = isValidObjectId(req.params.postId);

    if (!isValid) {
      const errorsMessages: ErrorMessageSchema[] = [
        {
          message: 'Not valid',
          field: 'postId',
        },
      ];

      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages });
      return;
    }

    const post = await mongoDBRepository.getById<PostDbType>(postsCollection, req.params.postId);

    if (!post) {
      const errorsMessages: ErrorMessageSchema[] = [
        {
          message: 'Not founded',
          field: 'postId',
        },
      ];
      res.status(HTTP_STATUSES.NOT_FOUND_404).json({ errorsMessages });
      return;
    }

    const insertedId = await createCommentService(req.body, req.params, res.locals.user!);

    const comment = await queryRepository.findEntityAndMapIdField<CommentDbType, GetCommentSchema>(
      commentsCollection,
      insertedId.toString(),
      ['postId']
    );

    if (comment) {
      res.status(HTTP_STATUSES.CREATED_201).json(comment);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    return;
  }
};
