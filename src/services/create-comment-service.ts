import { CreateCommentSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { commentsCollection } from '../db/collection';
import { CommentDbType } from '../types/comments-types';
import { getCurrentDate } from '../utils/helpers';

export const createCommentService = async (
  body: CreateCommentSchema,
  params: { postId: string },
  user: { userId: string; userLogin: string }
) => {
  const newComment: CommentDbType = {
    content: body.content,
    commentatorInfo: {
      userId: user.userId,
      userLogin: user.userLogin,
    },
    postId: params.postId,
    createdAt: getCurrentDate(),
  };

  const { insertedId } = await mongoDBRepository.add<CommentDbType>(commentsCollection, newComment);

  return insertedId;
};
