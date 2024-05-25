import { Response } from 'express';
import { GetCommentListSchema } from '../../models';
import { HTTP_STATUSES } from '../../utils/consts';
import { RequestWithQueryAndParams } from '../../types/request-types';
import { GetPostsQuery } from '../../types/post-types';
import { getPageCount, isValidObjectId, searchQueryBuilder } from '../../utils/helpers';
import { queryRepository } from '../../repositories/queryRepository';
import { commentsCollection, postsCollection } from '../../db/collection';
import { GetCommentSchema } from '../../models/comments/GetCommentSchema';
import { CommentDbType } from '../../types/comments-types';
import { mongoDBRepository } from '../../repositories/db-repository';

export const getCommentsForPostController = async (
  req: RequestWithQueryAndParams<GetPostsQuery, { postId: string }>,
  res: Response<GetCommentListSchema>
) => {
  try {
    const isValid = isValidObjectId(req.params.postId);

    if (!isValid) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    const post = await mongoDBRepository.getById(postsCollection, req.params.postId);
    if (!post) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    const filters = searchQueryBuilder.getComments(req.query, { postId: req.params.postId });

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
