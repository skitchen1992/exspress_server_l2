import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreateCommentSchema, ResponseErrorSchema } from '../../models';
import { RequestWithParamsAndBody } from '../../types/request-types';
import { CreateCommentSchemaResponse } from '../../models/comments/CreateCommentSchemaResponse';
import { createCommentService } from '../../services/create-comment-service';

type ResponseType = CreateCommentSchemaResponse | ResponseErrorSchema;

export const createCommentController = async (
  req: RequestWithParamsAndBody<CreateCommentSchema, { postId: string }>,
  res: Response<ResponseType>
) => {
  try {
    const comment = await createCommentService(req.body, req.params);

    if (comment) {
      res.status(HTTP_STATUSES.CREATED_201).json(comment);
    } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Not found',
            field: 'Comment',
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};
