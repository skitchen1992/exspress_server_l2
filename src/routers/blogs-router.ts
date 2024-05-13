import { Router } from 'express';
import { getBlogsQueryParams, getPostsQueryParams, PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { validateBlogPostSchema, validateBlogPutSchema } from '../middlewares/blogs';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { CreateBlogSchema, UpdateBlogSchema } from '../models';
import { checkBlogExistsMiddleware } from '../middlewares/posts/check-blog-exists-middleware';
import { CreatePostForBlogSchema } from '../models/posts/CreatePostForBlogSchema';
import { validateCreatePostForBlogSchema } from '../middlewares/posts/validate-schemas/validate-create-post-for-blog-schema';

export const blogsRouter = Router();

blogsRouter.get(
  PATH_URL.ROOT,
  sanitizerQueryMiddleware(getBlogsQueryParams),
  errorHandlingMiddleware,
  controllers.getBlogsController
);

blogsRouter.get(PATH_URL.ID, sanitizerQueryMiddleware(), errorHandlingMiddleware, controllers.getBlogByIdController);

blogsRouter.get(
  PATH_URL.POSTS_FOR_BLOG,
  sanitizerQueryMiddleware(getPostsQueryParams),
  checkBlogExistsMiddleware.urlParams('blogId'),
  errorHandlingMiddleware,
  controllers.getPostsForBlogController
);

blogsRouter.post(
  PATH_URL.ROOT,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  //remove for tests
  //checkExactMiddleware(validateBlogPostSchema),
  validateBlogPostSchema(),
  errorHandlingMiddleware<CreateBlogSchema>,
  controllers.createBlogController
);

blogsRouter.post(
  PATH_URL.POSTS_FOR_BLOG,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  //remove for tests
  //checkExactMiddleware(validateBlogPostSchema),
  validateCreatePostForBlogSchema(),
  checkBlogExistsMiddleware.urlParams('blogId'),
  errorHandlingMiddleware<CreatePostForBlogSchema>,
  controllers.createPostForBlogController
);

blogsRouter.put(
  PATH_URL.ID,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  //remove for tests
  //checkExactMiddleware(validateBlogPutSchema),
  validateBlogPutSchema(),
  errorHandlingMiddleware<UpdateBlogSchema>,
  controllers.updateBlogController
);

blogsRouter.delete(
  PATH_URL.ID,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.deleteBlogController
);
