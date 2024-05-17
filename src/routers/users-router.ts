import { Router } from 'express';
import { getUsersQueryParams, PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { validateBlogPostSchema } from '../middlewares/blogs';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { CreateUserSchema } from '../models';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { validateUserPostSchema } from '../middlewares/users';

export const usersRouter = Router();

usersRouter.get(
  PATH_URL.ROOT,
  sanitizerQueryMiddleware(getUsersQueryParams),
  errorHandlingMiddleware<CreateUserSchema>,
  controllers.getUsersController
);

usersRouter.post(
  PATH_URL.ROOT,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  //checkExactMiddleware(validateUserPostSchema),
  validateUserPostSchema(),
  errorHandlingMiddleware<CreateUserSchema>,
  controllers.createUserController
);

usersRouter.delete(
  PATH_URL.ID,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.deleteUserController
);
