import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { GetPostListSchema } from '../../models';
import { RequestWithQueryAndParams } from '../../types/request-types';
import { getPostsService } from '../../services/get-posts-service';
import { GetPostsQuery } from '../../types/post-types';

export const getPostsForBlogController = async (
  req: RequestWithQueryAndParams<GetPostsQuery, { blogId: string }>,
  res: Response<GetPostListSchema>
) => {
  try {
    const posts = await getPostsService(req);

    res.status(HTTP_STATUSES.OK_200).json(posts);
  } catch (e) {
    console.log(e);
  }
};
