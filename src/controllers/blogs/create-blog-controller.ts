import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreateBlogSchema, CreateBlogSchemaResponse, GetBlogSchema, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { createBlogService } from '../../services/create-blog-service';
import { queryRepository } from '../../repositories/queryRepository';
import { BlogDbType } from '../../types/blog-types';
import { blogsCollection } from '../../db';

type ResponseType = CreateBlogSchemaResponse | ResponseErrorSchema;

export const createBlogController = async (req: RequestWithBody<CreateBlogSchema>, res: Response<ResponseType>) => {
  try {
    const insertedId = await createBlogService(req.body);

    const blog = await queryRepository.findEntityAndMapIdField<BlogDbType, GetBlogSchema>(
      blogsCollection,
      insertedId.toString()
    );

    if (blog) {
      res.status(HTTP_STATUSES.CREATED_201).json(blog);
    } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Not found',
            field: `Post`,
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};
