import { Response } from 'express';
import { ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { AuthRegistrationSchema } from '../../models/auth/AuthRegistrationSchema';
import { HTTP_STATUSES } from '../../utils/consts';
import { emailService } from '../../services/email-service';

export const authRegistrationController = async (
  req: RequestWithBody<AuthRegistrationSchema>,
  res: Response<ResponseErrorSchema>
) => {
  try {
    await emailService.sendRegisterEmail(req.body.email, 'link');

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e) {
    console.log(e);
    res.sendStatus(HTTP_STATUSES.INTERNAL_SERVER_ERROR_500);
  }
};
