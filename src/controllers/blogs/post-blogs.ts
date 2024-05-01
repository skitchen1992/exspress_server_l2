import { db } from '../../db/db';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { PostBlogSchema, PostBlogSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';

export const postBlogsController = async (req: RequestWithBody<PostBlogSchema>, res: Response<PostBlogSchemaResponse | ResponseErrorSchema>) => {
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

