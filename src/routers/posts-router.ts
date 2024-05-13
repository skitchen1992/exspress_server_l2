import { Router } from 'express';
import { getPostsQueryParams, PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { validateCreatePostSchema, validateUpdatePostSchema } from '../middlewares/posts';
import { CreatePostSchema, UpdatePostSchema } from '../models';
import { checkBlogExistsMiddleware } from '../middlewares/posts/check-blog-exists-middleware';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';

export const postsRouter = Router();

postsRouter.get(
  PATH_URL.ROOT,
  sanitizerQueryMiddleware(getPostsQueryParams),
  errorHandlingMiddleware,
  controllers.getPostsController
);

postsRouter.get(PATH_URL.ID, sanitizerQueryMiddleware(), errorHandlingMiddleware, controllers.getPostByIdController);

postsRouter.post(
  PATH_URL.ROOT,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateCreatePostSchema),
  checkBlogExistsMiddleware.body('blogId'),
  errorHandlingMiddleware<CreatePostSchema>,
  controllers.createPostController
);

postsRouter.put(
  PATH_URL.ID,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateUpdatePostSchema),
  checkBlogExistsMiddleware.body('blogId'),
  errorHandlingMiddleware<UpdatePostSchema>,
  controllers.updatePostController
);

postsRouter.delete(
  PATH_URL.ID,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.deletePostController
);
