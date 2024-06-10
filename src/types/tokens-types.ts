import { ObjectId } from 'mongodb';

export type TokenDbType = {
  refreshToken: string;
  createdAt: string;
  isExpired: boolean;
  userId: string;
  _id: ObjectId;
};
