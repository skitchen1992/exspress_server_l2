import { Router } from 'express';
import { getPostsQueryParams, PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { validateCreatePostSchema, validateUpdatePostSchema } from '../middlewares/posts';
import { CreateCommentSchema, CreatePostSchema, UpdatePostSchema } from '../models';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { validateCreateCommentSchema } from '../middlewares/posts/validate-schemas/validate-create-comment-schema';

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
  errorHandlingMiddleware<CreatePostSchema>,
  controllers.createPostController
);

postsRouter.put(
  PATH_URL.ID,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateUpdatePostSchema),
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

postsRouter.post(
  PATH_URL.COMMENT_FOR_POST,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateCreateCommentSchema),
  errorHandlingMiddleware<CreateCommentSchema>,
  controllers.createCommentController
);

postsRouter.get(
  PATH_URL.COMMENT_FOR_POST,
  sanitizerQueryMiddleware(getPostsQueryParams),
  errorHandlingMiddleware,
  controllers.getCommentsForPostController
);
