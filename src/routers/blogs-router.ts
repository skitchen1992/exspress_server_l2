import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import * as controllers  from '../controllers';
import { validatePostSchema, validatePutSchema } from '../middlewares/blogs';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';

export const blogsRouter = Router();

blogsRouter.get(PATH_URL.ROOT, controllers.getBlogsController);

blogsRouter.get(PATH_URL.ID, controllers.getBlogByIdController);

blogsRouter.post(PATH_URL.ROOT,
  checkExactMiddleware(validatePostSchema),
  errorHandlingMiddleware,
  controllers.postBlogController,
);

blogsRouter.put(PATH_URL.ID,
  checkExactMiddleware(validatePutSchema),
  errorHandlingMiddleware,
  controllers.putBlogController,
);
