import { Response } from 'express';
import { ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { HTTP_STATUSES } from '../../utils/consts';
import { queryRepository } from '../../repositories/queryRepository';
import { ResultStatus } from '../../types/common/result';
import { getCurrentDate, isExpiredDate } from '../../utils/dates/dates';
import { AuthRegistrationResendingSchema } from '../../models/auth/AuthRegistrationResendingSchema';
import { emailService } from '../../services/email-service';
import { deleteUserService } from '../../services/delete-user-service';

export const authRegistrationResendingController = async (
  req: RequestWithBody<AuthRegistrationResendingSchema>,
  res: Response<ResponseErrorSchema>
) => {
  try {
    const { status, data } = await queryRepository.getUserByEmail(req.body.email);

    if (status === ResultStatus.BagRequest) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Email not found',
            field: 'email',
          },
        ],
      });
      return;
    }

    if (status === ResultStatus.Success && data!.isConfirmed) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Email already confirmed',
            field: 'email',
          },
        ],
      });
      return;
    }

    if (status === ResultStatus.Success && isExpiredDate(data!.expirationDate, getCurrentDate())) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Confirmation code expired',
            field: 'code',
          },
        ],
      });
      return;
    }

    try {
      await emailService.sendRegisterEmail(req.body.email, data!.confirmationCode);

      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
      return;
    } catch (e) {
      await deleteUserService(data!.id);
    }
  } catch (e) {
    res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
      errorsMessages: [
        {
          message: 'Email and login should be unique',
          field: 'email',
        },
      ],
    });
  }
};
