import { Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { RequestWithParams } from '../../types/request-types';
import { mongoDBRepository } from '../../repositories/db-repository';
import { postsCollection } from '../../db/collection';

type RequestType = RequestWithParams<{ id: string }>;

export const deletePostController = async (req: RequestType, res: Response) => {
  try {
    const deleteResult = await mongoDBRepository.delete(postsCollection, req.params.id);

    if (deleteResult.deletedCount === 1) {
      res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
    } else {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404);
    }
  } catch (e) {
    console.log(e);
  }
};
