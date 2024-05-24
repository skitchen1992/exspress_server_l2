import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { validateAuthPostSchema } from '../middlewares/auth';
import { bearerTokenAuthMiddleware } from '../middlewares/bearer-token-auth-middleware';
import { AuthUserSchema } from '../models';

export const authRouter = Router();

authRouter.post(
  PATH_URL.AUTH.LOGIN,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateAuthPostSchema),
  errorHandlingMiddleware<AuthUserSchema>,
  controllers.authController
);

authRouter.get(
  PATH_URL.AUTH.ME,
  bearerTokenAuthMiddleware,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.meController
);
