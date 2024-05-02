import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';

export const postsRouter = Router()

postsRouter.get(PATH_URL.ROOT,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.getPostsController);

postsRouter.get(PATH_URL.ID,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.getPostByIdController);
