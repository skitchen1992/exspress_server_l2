import { Request, Response } from 'express';
import { HTTP_STATUSES } from '../../utils/consts';
import { blogsCollection, postsCollection } from '../../db';

export const deleteAllDataController = async (req: Request, res: Response) => {
  try {
    await blogsCollection.deleteMany({});
    await postsCollection.deleteMany({});

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204);
  } catch (e) {
    console.log(e);
  }
};
