import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { AuthUserSchema } from '../models/auth/AuthUserSchema';
import { validateAuthPostSchema } from '../middlewares/auth';

export const authRouter = Router();

authRouter.post(
  PATH_URL.AUTH.LOGIN,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateAuthPostSchema),
  errorHandlingMiddleware<AuthUserSchema>,
  controllers.authController
);
