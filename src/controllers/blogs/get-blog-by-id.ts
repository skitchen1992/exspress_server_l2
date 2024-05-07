import { db } from '../../db/db';
import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { GetBlogSchema, ResponseErrorSchema } from '../../models';
import { RequestWithPrams } from '../../types/request-types';
import { mongoDB } from '../../db/database';
import { BlogDbType } from '../../types/blog_types';
import { blogsCollection } from '../../db';
import { mapIdField } from '../../utils/helpers';

type ResponseType = GetBlogSchema | ResponseErrorSchema;

export const getBlogByIdController = async (req: RequestWithPrams<{ id: string }>, res: Response<ResponseType>) => {
  try {
    const blog = await mongoDB.getById<BlogDbType>(blogsCollection, req.params.id);

    if (blog) {
      const mapBlogs = mapIdField<GetBlogSchema>(blog);

      res.status(HTTP_STATUSES.OK_200).json(mapBlogs);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};
