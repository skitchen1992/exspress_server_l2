import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { CreateUserSchema, CreateUserSchemaResponse, ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { createUserService } from '../../services/create-user-service';

type ResponseType = CreateUserSchemaResponse | ResponseErrorSchema;

export const createUserController = async (req: RequestWithBody<CreateUserSchema>, res: Response<ResponseType>) => {
  try {
    const user = await createUserService(req);

    if (user) {
      res.status(HTTP_STATUSES.CREATED_201).json(user);
    } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Not found',
            field: `User`,
          },
        ],
      });
    }
  } catch (e) {
    console.log(e);
  }
};
