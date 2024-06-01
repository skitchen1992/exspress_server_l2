import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { validateAuthPostSchema } from '../middlewares/auth';
import { bearerTokenAuthMiddleware } from '../middlewares/bearer-token-auth-middleware';
import { AuthUserSchema } from '../models';
import { validateAuthRegistrationSchema } from '../middlewares/auth/validate-schemas/validate-auth-registration-schema';
import { validateAuthRegistrationConfirmationSchema } from '../middlewares/auth/validate-schemas/validate-auth-registration-confirmation-schema';
import { validateAuthRegistrationResendingSchema } from '../middlewares/auth/validate-schemas/validate-auth-registration-resending-schema';

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

authRouter.post(
  PATH_URL.AUTH.REGISTRATION,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateAuthRegistrationSchema),
  errorHandlingMiddleware,
  controllers.authRegistrationController
);

authRouter.post(
  PATH_URL.AUTH.REGISTRATION_CONFIRMATION,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateAuthRegistrationConfirmationSchema),
  errorHandlingMiddleware,
  controllers.authRegistrationConfirmationController
);

authRouter.post(
  PATH_URL.AUTH.REGISTRATION_EMAIL_RESENDING,
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateAuthRegistrationResendingSchema),
  errorHandlingMiddleware,
  controllers.authRegistrationResendingController
);
