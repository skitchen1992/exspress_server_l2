import { Response } from 'express';
import { ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { HTTP_STATUSES } from '../../utils/consts';
import { queryRepository } from '../../repositories/queryRepository';
import { ResultStatus } from '../../types/common/result';
import { AuthRegistrationConfirmationSchema } from '../../models/auth/AuthRegistrationConfirmationSchema';
import { getCurrentDate, isExpiredDate } from '../../utils/dates/dates';
import { updateUserConfirmationService } from '../../services/update-user-confermation-service';

export const authRegistrationConfirmationController = async (
  req: RequestWithBody<AuthRegistrationConfirmationSchema>,
  res: Response<ResponseErrorSchema>
) => {
  try {
    const { status, data } = await queryRepository.getUserByConfirmationCode(req.body.code);

    if (status === ResultStatus.BagRequest) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Activation code is not correct',
            field: 'Code',
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
            field: 'Code',
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
            field: 'Code',
          },
        ],
      });
      return;
    }

    const { status: updateStatus } = await updateUserConfirmationService(data!.id);

    if (updateStatus === ResultStatus.Success) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Email is not confirmed',
            field: 'Code',
          },
        ],
      });
    }
  } catch (e) {
    res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
      errorsMessages: [
        {
          message: 'Email and login should be unique',
          field: 'User',
        },
      ],
    });
  }
};
