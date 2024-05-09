import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreatePostSchema, CreatePostSchemaResponse, GetPostSchema, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { mongoDB } from '../../db/database';
import { blogsCollection, postsCollection } from '../../db';
import { mapIdField } from '../../utils/helpers';
import { PostDbType } from '../../types/post-types';
import { BlogDbType } from '../../types/blog_types';

type ResponseType = CreatePostSchemaResponse | ResponseErrorSchema;

export const postPostController = async (req: RequestWithBody<CreatePostSchema>, res: Response<ResponseType>) => {
  try {
    const blog = await mongoDB.getById<BlogDbType>(blogsCollection, req.body.blogId);

    const newPost: PostDbType = {
      ...req.body,
      blogName: blog!.name,
      blogId: blog!._id.toString(),
      createdAt: new Date().toISOString(),
    };

    const result = await mongoDB.add<PostDbType>(postsCollection, newPost);
    const post = await mongoDB.getById<PostDbType>(postsCollection, result.insertedId.toString());

    if (result.acknowledged && post) {
      const mapPosts = mapIdField<GetPostSchema>(post);

      res.status(HTTP_STATUSES.CREATED_201).json(mapPosts);
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
