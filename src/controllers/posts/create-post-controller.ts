import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreatePostSchema, CreatePostSchemaResponse, GetPostSchema, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { createPostService } from '../../services/create-post-service';
import { mongoDBRepository } from '../../repositories/db-repository';
import { BlogDbType } from '../../types/blog-types';
import { blogsCollection, postsCollection } from '../../db/collection';
import { isValidObjectId } from '../../utils/helpers';
import { ErrorMessageSchema } from '../../models/errors/ErrorMessageSchema';
import { queryRepository } from '../../repositories/queryRepository';
import { PostDbType } from '../../types/post-types';

type ResponseType = CreatePostSchemaResponse | ResponseErrorSchema;

export const createPostController = async (req: RequestWithBody<CreatePostSchema>, res: Response<ResponseType>) => {
  try {
    const isValid = isValidObjectId(req.body.blogId);

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

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, req.body.blogId);

    if (!blog) {
      const errorsMessages: ErrorMessageSchema[] = [
        {
          message: 'Not founded',
          field: 'blogId',
        },
      ];
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({ errorsMessages });
      return;
    }

    const insertedId = await createPostService(req.body, blog);

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
