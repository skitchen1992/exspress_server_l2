import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreateBlogSchema, CreateBlogSchemaResponse, GetBlogSchema, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { mongoDB } from '../../db/database';
import { BlogDbType } from '../../types/blog_types';
import { blogsCollection } from '../../db';
import { mapIdField } from '../../utils/helpers';
import { PostDbType } from '../../types/post-types';

type ResponseType = CreateBlogSchemaResponse | ResponseErrorSchema;

export const postBlogController = async (req: RequestWithBody<CreateBlogSchema>, res: Response<ResponseType>) => {
  try {
    const newBlog: BlogDbType = {
      ...req.body,
      createdAt: new Date().toISOString(),
      isMembership: true,
    };
    const result = await mongoDB.add<BlogDbType>(blogsCollection, newBlog);
    const blog = await mongoDB.getById<BlogDbType>(blogsCollection, result.insertedId.toString());

    if (result.acknowledged && blog) {
      const mapBlogs = mapIdField<GetBlogSchema>(blog);

      res.status(HTTP_STATUSES.CREATED_201).json(mapBlogs);
    } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Not found',
            field: `Post ID: ${result.insertedId}`,
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};
