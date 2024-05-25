import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { GetPostSchema, ResponseErrorSchema } from '../../models';
import { RequestWithParams } from '../../types/request-types';
import { mongoDBRepository } from '../../repositories/db-repository';
import { postsCollection } from '../../db/collection';
import { PostDbType } from '../../types/post-types';
import { mapIdField } from '../../utils/map';

type ResponseType = GetPostSchema | ResponseErrorSchema;

export const getPostByIdController = async (req: RequestWithParams<{ id: string }>, res: Response<ResponseType>) => {
  try {
    const post = await mongoDBRepository.getById<PostDbType>(postsCollection, req.params.id);

    if (post) {
      const mapBlogs = mapIdField<GetPostSchema>(post);

      res.status(HTTP_STATUSES.OK_200).json(mapBlogs);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};

// {
//   "pagesCount": 1,
//   "page": 1,
//   "pageSize": 10,
//   "totalCount": 3,
//   "items": [
//   {
//     "id": "6651e5cf985708586957bcb4",
//     "content": "stringstringstringst",
//     "commentatorInfo": {
//       "userId": "664f4f086791bd1b92f5e8a5",
//       "userLogin": "kLNWULRLEs"
//     },
//     "createdAt": "2024-05-25T13:21:19.097Z"
//   },
//   {
//     "id": "664f7cf3e693a1d06320e534",
//     "content": "stringstringstringst",
//     "commentatorInfo": {
//       "userId": "664f4f086791bd1b92f5e8a5",
//       "userLogin": "kLNWULRLEs"
//     },
//     "createdAt": "2024-05-23T17:29:23.703Z"
//   },
//   {
//     "id": "664f784b0e6332c263e48b22",
//     "content": "stringstringstringst",
//     "commentatorInfo": {
//       "userId": "664f4f086791bd1b92f5e8a5",
//       "userLogin": "kLNWULRLEs"
//     },
//     "createdAt": "2024-05-23T17:09:31.978Z"
//   }
// ]
// }
