import { WithId } from 'mongodb';
import { GetUserSchema } from '../models';
import { UserDbType } from '../types/users-types';

export const mapIdField = <R>(object: WithId<Record<string, unknown>>): R => {
  if (object && typeof object === 'object') {
    const { _id, ...rest } = object;
    return { id: _id, ...rest } as R;
  }
  return object as R;
};

export const mapIdFieldInArray = <R, I extends WithId<Record<string, unknown>>>(array: I[]): R[] => {
  return array.map((object) => mapIdField<R>(object));
};

export const mapIdAndPassFieldsField = <R>(object: WithId<Record<string, unknown>>): R => {
  if (object && typeof object === 'object') {
    const { _id, password, ...rest } = object;
    return { id: _id, ...rest } as R;
  }
  return object as R;
};

export const mapIdAndPassFieldsInArray = <R, I extends WithId<Record<string, unknown>>>(array: I[]): R[] => {
  return array.map((object) => mapIdAndPassFieldsField<R>(object));
};

export const getPageCount = (totalCount: number, pageSize: number) => {
  return Math.ceil(totalCount / pageSize);
};
