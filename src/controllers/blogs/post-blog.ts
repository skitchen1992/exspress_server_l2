import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreateBlogSchema, CreateBlogSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { createBlogService } from '../../services/create-blog-service';

type ResponseType = CreateBlogSchemaResponse | ResponseErrorSchema;

export const postBlogController = async (req: RequestWithBody<CreateBlogSchema>, res: Response<ResponseType>) => {
  try {
    const blog = await createBlogService(req);

    if (blog) {
      res.status(HTTP_STATUSES.CREATED_201).json(blog);
    } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Not found',
            field: `Post`,
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};
