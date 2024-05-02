import { db } from '../../db/db';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { PostBlogSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestWithPrams } from '../../types/request-types';

type ResponseType = PostBlogSchemaResponse | ResponseErrorSchema

export const getBlogByIdController = async (req: RequestWithPrams<{ id: string }>, res: Response<ResponseType>) => {
  try {
    const id = req.params.id;
    const blog = await db.getBlogById(id);

    if (blog) {
      res.status(HTTP_STATUSES.OK_200).json(blog);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};

