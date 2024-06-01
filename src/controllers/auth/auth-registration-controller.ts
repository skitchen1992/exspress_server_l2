import { Response } from 'express';
import { ResponseErrorSchema } from '../../models';
import { RequestWithBody } from '../../types/request-types';
import { AuthRegistrationSchema } from '../../models/auth/AuthRegistrationSchema';
import { HTTP_STATUSES } from '../../utils/consts';
import { emailService } from '../../services/email-service';
import { queryRepository } from '../../repositories/queryRepository';
import { ResultStatus } from '../../types/common/result';
import { createUserWithConfirmationService } from '../../services/create-user-with-confirmation-service';
import { deleteUserService } from '../../services/delete-user-service';

export const authRegistrationController = async (
  req: RequestWithBody<AuthRegistrationSchema>,
  res: Response<ResponseErrorSchema>
) => {
  try {
    const { status } = await queryRepository.isExistsUser(req.body.login, req.body.email);

    if (status === ResultStatus.BagRequest) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
        errorsMessages: [
          {
            message: 'Email and login should be unique',
            field: 'email',
          },
        ],
      });
      return;
    }

    const { data: userId, status: getUserStatus } = await createUserWithConfirmationService(req.body);

    if (getUserStatus === ResultStatus.Success) {
      const { data, status } = await queryRepository.getUserConfirmationData(userId!);

      if (status === ResultStatus.Success) {
        try {
          //for tests
          res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
          await emailService.sendRegisterEmail(req.body.email, data!.confirmationCode);

          return;
        } catch (e) {
          await deleteUserService(userId!);
        }
      }

      if (status === ResultStatus.NotFound) {
        res.status(HTTP_STATUSES.BAD_REQUEST_400).json({
          errorsMessages: [
            {
              message: 'Email and login should be unique',
              field: 'email',
            },
          ],
        });
        return;
      }
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
