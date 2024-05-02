import { db } from '../../db/db';
import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';

export const deleteAllDataController = async (req: Request, res: Response) => {
  try {
    db.clearDB();
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e) {
    console.log(e);
  }
};

