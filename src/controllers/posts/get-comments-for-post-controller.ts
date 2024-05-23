import { Response } from 'express';
import { GetCommentListSchema } from '../../models';
import { HTTP_STATUSES } from '../../utils/consts';
import { RequestWithQuery } from '../../types/request-types';
import { GetPostsQuery } from '../../types/post-types';
import { getPageCount, searchQueryBuilder } from '../../utils/helpers';
import { queryRepository } from '../../repositories/queryRepository';
import { commentsCollection } from '../../db/collection';
import { GetCommentSchema } from '../../models/comments/GetCommentSchema';
import { CommentDbType } from '../../types/comments-types';

export const getCommentsForPostController = async (
  req: RequestWithQuery<GetPostsQuery>,
  res: Response<GetCommentListSchema>
) => {
  try {
    const filters = searchQueryBuilder.getPosts(req.query, {});

    const { entities: commentList, totalCount } = await queryRepository.findEntitiesAndMapIdFieldInArray<
      CommentDbType,
      GetCommentSchema
    >(commentsCollection, filters);

    const comments: GetCommentListSchema = {
      pagesCount: getPageCount(totalCount, filters.pageSize),
      page: filters.page,
      pageSize: filters.pageSize,
      totalCount,
      items: commentList,
    };

    res.status(HTTP_STATUSES.OK_200).json(comments);
  } catch (e) {
    console.log(e);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
