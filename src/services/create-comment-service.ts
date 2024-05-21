import { RequestWithParamsAndBody } from '../types/request-types';
import { CreateCommentSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { commentsCollection, postsCollection } from '../db';
import { PostDbType } from '../types/post-types';
import { CommentDbType } from '../types/comments-types';
import { getCurrentDate } from '../utils/helpers';
import { queryRepository } from '../repositories/queryRepository';
import { GetCommentSchema } from '../models/comments/GetCommentSchema';

export const createCommentService = async (body: CreateCommentSchema, params: { postId: string }) => {
  const post = await mongoDBRepository.getById<PostDbType>(postsCollection, params.postId);

  if (!post) {
    return null;
  }

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

  const comment = await queryRepository.findEntityAndMapIdField<CommentDbType, GetCommentSchema>(
    commentsCollection,
    insertedId.toString()
  );
  if (comment) {
    return comment;
  } else {
    return null;
  }
};
