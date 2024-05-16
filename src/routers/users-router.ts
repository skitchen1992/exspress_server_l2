import { Router } from 'express';
import { getBlogsQueryParams, getUsersQueryParams, PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { validateBlogPostSchema } from '../middlewares/blogs';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { CreateBlogSchema, CreateUserSchema } from '../models';
import { getUsersController } from '../controllers/users/get-users-controller';

export const usersRouter = Router();

usersRouter.get(
  PATH_URL.ROOT,
  sanitizerQueryMiddleware(getUsersQueryParams),
  errorHandlingMiddleware<CreateUserSchema>,
  controllers.getUsersController
);

// usersRouter.post(
//   PATH_URL.ROOT,
//   basicAuthMiddleware,
//   sanitizerQueryMiddleware(),
//   //remove for tests
//   //checkExactMiddleware(validateBlogPostSchema),
//   validateBlogPostSchema(),
//   errorHandlingMiddleware<CreateUserSchema>,
//   controllers.createBlogController
// );
//
// usersRouter.delete(
//   PATH_URL.ID,
//   basicAuthMiddleware,
//   sanitizerQueryMiddleware(),
//   errorHandlingMiddleware,
//   controllers.deleteBlogController
// );
