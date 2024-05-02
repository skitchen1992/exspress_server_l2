import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { validatePostSchema, validatePutSchema } from '../middlewares/blogs';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';

export const blogsRouter = Router();

blogsRouter.get(PATH_URL.ROOT,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.getBlogsController);

blogsRouter.get(PATH_URL.ID,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.getBlogByIdController);

blogsRouter.post(PATH_URL.ROOT,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validatePostSchema),
  errorHandlingMiddleware,
  controllers.postBlogController,
);

blogsRouter.put(PATH_URL.ID,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validatePutSchema),
  errorHandlingMiddleware,
  controllers.putBlogController,
);

blogsRouter.delete(PATH_URL.ID,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.deleteBlogController,
);
