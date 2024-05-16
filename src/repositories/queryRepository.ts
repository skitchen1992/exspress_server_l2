import { GetQuerySettings, mongoDBRepository } from './db-repository';
import { Collection } from 'mongodb';
import { Document } from 'bson';
import { mapIdField, mapIdFieldInArray } from '../utils/helpers';

export const queryRepository = {
  findEntityAndMapIdField: async <T extends Document, R>(collection: Collection<T>, id: string): Promise<R | null> => {
    const entity = await mongoDBRepository.getById(collection, id);

    return entity ? mapIdField(entity) : null;
  },
  findEntitiesAndMapIdFieldInArray: async <T extends Document, R>(
    collection: Collection<T>,
    settings: GetQuerySettings
  ): Promise<R[] | null> => {
    const entities = await mongoDBRepository.get<T>(collection, settings);

    return entities ? mapIdFieldInArray(entities) : null;
  },
};
