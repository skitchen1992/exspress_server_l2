import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { GetBlogSchema } from '../../models';
import { RequestWithParams } from '../../types/request-types';
import { mongoDBRepository } from '../../repositories/db-repository';
import { BlogDbType } from '../../types/blog-types';
import { blogsCollection } from '../../db/collection';

import { mapIdField } from '../../utils/map';

type ResponseType = GetBlogSchema | null;

export const getBlogByIdController = async (req: RequestWithParams<{ id: string }>, res: Response<ResponseType>) => {
  try {
    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, req.params.id);

    if (blog) {
      const mapBlogs = mapIdField<GetBlogSchema>(blog);

      res.status(HTTP_STATUSES.OK_200).json(mapBlogs);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
