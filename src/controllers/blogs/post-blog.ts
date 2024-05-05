import { db } from '../../db/db';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreateBlogSchema, CreateBlogSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';

type ResponseType = CreateBlogSchemaResponse | ResponseErrorSchema

export const postBlogController = async (req: RequestWithBody<CreateBlogSchema>, res: Response<ResponseType>) => {
  try {
    const id = await db.addBlog(req.body);

    const newBlog = await db.getBlogById(id);

    if (newBlog) {
      res.status(HTTP_STATUSES.CREATED_201).json(newBlog);
    } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Not found',
            field: `Post ID: ${id}`,
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};

