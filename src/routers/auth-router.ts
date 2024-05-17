import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { basicAuthMiddleware } from '../middlewares/basic-auth-middleware';
import { AuthUserSchema } from '../models/Auth/AuthUserSchema';
import { validateAuthPostSchema } from '../middlewares/auth';

export const authRouter = Router();

authRouter.post(
  PATH_URL.AUTH.LOGIN,
  basicAuthMiddleware,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateAuthPostSchema),
  errorHandlingMiddleware<AuthUserSchema>,
  controllers.authController
);
