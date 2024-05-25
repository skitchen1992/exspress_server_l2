import { WithId } from 'mongodb';

export const mapIdField = <R>(object: WithId<Record<string, unknown>>, fieldsToRemove: string[] = []): R => {
  if (object && typeof object === 'object') {
    const { _id, ...rest } = object;

    let result: Record<string, unknown> = { id: _id, ...rest };
    for (const field of fieldsToRemove) {
      delete result[field];
    }

    return result as R;
  }
  return object as R;
};

export const mapIdFieldInArray = <R, I extends WithId<Record<string, unknown>>>(
  array: I[],
  fieldsToRemove?: string[]
): R[] => {
  return array.map((object) => mapIdField<R>(object, fieldsToRemove));
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
