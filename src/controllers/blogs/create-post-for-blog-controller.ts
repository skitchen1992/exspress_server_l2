import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreatePostSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestWithParamsAndBody } from '../../types/request-types';
import { CreatePostForBlogSchema } from '../../models/posts/CreatePostForBlogSchema';
import { createPostForBlogService } from '../../services/create-post-for-blog-service';

type ResponseType = CreatePostSchemaResponse | ResponseErrorSchema;

export const createPostForBlogController = async (
  req: RequestWithParamsAndBody<CreatePostForBlogSchema, { blogId: string }>,
  res: Response<ResponseType>
) => {
  try {
    const post = await createPostForBlogService(req);

    if (post) {
      res.status(HTTP_STATUSES.CREATED_201).json(post);
    } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Not found',
            field: `Blog ID: ${req.params.blogId}`,
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};
