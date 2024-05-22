import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreatePostSchemaResponse, GetPostSchema, ResponseErrorSchema } from '../../models';
import { RequestWithParamsAndBody } from '../../types/request-types';
import { CreatePostForBlogSchema } from '../../models/posts/CreatePostForBlogSchema';
import { createPostForBlogService } from '../../services/create-post-for-blog-service';
import { mongoDBRepository } from '../../repositories/db-repository';
import { BlogDbType } from '../../types/blog-types';
import { blogsCollection, postsCollection } from '../../db';
import { PostDbType } from '../../types/post-types';
import { queryRepository } from '../../repositories/queryRepository';
import { isValidObjectId } from '../../utils/helpers';
import { ErrorMessageSchema } from '../../models/errors/ErrorMessageSchema';

type ResponseType = CreatePostSchemaResponse | ResponseErrorSchema;

export const createPostForBlogController = async (
  req: RequestWithParamsAndBody<CreatePostForBlogSchema, { blogId: string }>,
  res: Response<ResponseType>
) => {
  try {
    const isValid = isValidObjectId(req.params.blogId);

    if (!isValid) {
      const errorsMessages: ErrorMessageSchema[] = [
        {
          message: 'Not valid',
          field: 'blogId',
        },
      ];

      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages });
      return;
    }

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, req.params.blogId);

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    const insertedId = await createPostForBlogService(req.body, req.params);
    if (!insertedId) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
      return;
    }

    const post = await queryRepository.findEntityAndMapIdField<PostDbType, GetPostSchema>(
      postsCollection,
      insertedId.toString()
    );

    if (post) {
      res.status(HTTP_STATUSES.CREATED_201).json(post);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
    return;
  }
};
