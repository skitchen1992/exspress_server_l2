import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreatePostSchema, CreatePostSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { createPostService } from '../../services/create-post-service';

type ResponseType = CreatePostSchemaResponse | ResponseErrorSchema;

export const postPostController = async (req: RequestWithBody<CreatePostSchema>, res: Response<ResponseType>) => {
  try {
    const post = await createPostService(req);

    if (post) {
      res.status(HTTP_STATUSES.CREATED_201).json(post);
    } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Not found',
            field: `Blog ID: ${req.body.blogId}`,
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};
