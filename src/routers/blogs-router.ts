import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import { getBlogsController } from '../controllers';
import { postBlogsController } from '../controllers/blogs/post-blogs';
import { errorHandlingMiddleware } from '../middlewares/blogs/validation-middleware';
import { validatePostSchema } from '../middlewares/blogs';

export const blogsRouter = Router();

blogsRouter.get(PATH_URL.ROOT, getBlogsController);

blogsRouter.post(PATH_URL.ROOT,
  validatePostSchema(),
  errorHandlingMiddleware,
  postBlogsController,
);
