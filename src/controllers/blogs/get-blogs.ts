import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { GetBlogListSchema } from '../../models';
import { getBlogsService } from '../../services/get-blogs-service';
import { RequestWithQuery } from '../../types/request-types';
import { GetBlogsQuery } from '../../types/blog-types';

export const getBlogsController = async (req: RequestWithQuery<GetBlogsQuery>, res: Response<GetBlogListSchema>) => {
  try {
    const blogs = await getBlogsService(req);

    res.status(HTTP_STATUSES.OK_200).json(blogs);
  } catch (e) {
    console.log(e);
  }
};
