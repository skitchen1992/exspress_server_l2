import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { validatePostSchema, validatePutSchema } from '../middlewares/blogs';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { sanitizerMiddleware } from '../middlewares/sanitizer-middleware';


export const blogsRouter = Router();

blogsRouter.get(PATH_URL.ROOT,
  sanitizerMiddleware(),
  errorHandlingMiddleware,
  controllers.getBlogsController);

blogsRouter.get(PATH_URL.ID,
  sanitizerMiddleware(),
  errorHandlingMiddleware,
  controllers.getBlogByIdController);

blogsRouter.post(PATH_URL.ROOT,
  sanitizerMiddleware(),
  checkExactMiddleware(validatePostSchema),
  errorHandlingMiddleware,
  controllers.postBlogController,
);

blogsRouter.put(PATH_URL.ID,
  sanitizerMiddleware(),
  checkExactMiddleware(validatePutSchema),
  errorHandlingMiddleware,
  controllers.putBlogController,
);
