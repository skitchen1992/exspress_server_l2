import { Router } from 'express';
import { PATH_URL } from '../utils/consts';
import * as controllers from '../controllers';
import { errorHandlingMiddleware } from '../middlewares/error-handling-middleware';
import { sanitizerQueryMiddleware } from '../middlewares/sanitizer-query-middleware';
import { checkExactMiddleware } from '../middlewares/check-exact-middleware';
import { validateCommentsPutSchema } from '../middlewares/comments/validate-schemas/validate-comments-put-schema';
import { UpdateCommentSchema } from '../models/comments/UpdateCommentSchema';

export const commentsRouter = Router();

commentsRouter.get(
  PATH_URL.ID,
  sanitizerQueryMiddleware(),
  errorHandlingMiddleware,
  controllers.getCommentByIdController
);

commentsRouter.put(
  PATH_URL.ID,
  /*  TODO: need JWT Bearer token auth*/
  sanitizerQueryMiddleware(),
  checkExactMiddleware(validateCommentsPutSchema),
  errorHandlingMiddleware<UpdateCommentSchema>,
  controllers.updateCommentController
);
//
// commentsRouter.delete(
//   PATH_URL.ID,
//   basicAuthMiddleware,
//   sanitizerQueryMiddleware(),
//   errorHandlingMiddleware,
//   controllers.deleteUserController
// );
