import { CreateCommentSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { commentsCollection } from '../db';
import { CommentDbType } from '../types/comments-types';
import { getCurrentDate } from '../utils/helpers';

export const createCommentService = async (body: CreateCommentSchema, params: { postId: string }) => {
  //TODO: userId and userLogin need to get from Headers
  const newComment: CommentDbType = {
    content: body.content,
    commentatorInfo: {
      userId: 'string',
      userLogin: 'string',
    },
    createdAt: getCurrentDate(),
  };

  const { insertedId } = await mongoDBRepository.add<CommentDbType>(commentsCollection, newComment);

  return insertedId;
};
