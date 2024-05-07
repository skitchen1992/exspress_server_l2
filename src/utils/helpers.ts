import { WithId } from 'mongodb';

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
