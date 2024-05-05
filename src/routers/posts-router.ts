import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { validatePostsPostSchema, validatePostsPutSchema } from '../middlewares/posts';
import { CreatePostSchema, UpdatePostsSchema } from '../models';
import { checkBlogExistsMiddleware } from '../middlewares/posts/check-blog-exists-middleware';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';

export const postsRouter = Router();

postsRouter.get(PATH_URL.ROOT,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.getPostsController);

postsRouter.get(PATH_URL.ID,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.getPostByIdController);

postsRouter.post(PATH_URL.ROOT,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validatePostsPostSchema),
  checkBlogExistsMiddleware(),
  errorHandlingMiddleware<CreatePostSchema>,
  controllers.postPostController,
);

postsRouter.put(PATH_URL.ID,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validatePostsPutSchema),
  checkBlogExistsMiddleware(),
  errorHandlingMiddleware<UpdatePostsSchema>,
  controllers.putPostController,
);

postsRouter.delete(PATH_URL.ID,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.deletePostController,
);
