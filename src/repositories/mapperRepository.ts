import { GetQuerySettings, mongoDBRepository } from './db-repository';
import { Collection, Filter } from 'mongodb';
import { Document } from 'bson';
import { mapIdField, mapIdFieldInArray } from '../utils/map';

class MapperRepository {
  async findEntityAndMapIdField<T extends Document, R>(
    collection: Collection<T>,
    id: string,
    fieldsToRemove?: string[]
  ): Promise<R | null> {
    const entity = await mongoDBRepository.getById(collection, id);

    return entity ? mapIdField(entity, fieldsToRemove) : null;
  }

  async findEntitiesAndMapIdFieldInArray<T extends Document, R>(
    collection: Collection<T>,
    settings: GetQuerySettings,
    fieldsToRemove?: string[]
  ): Promise<{ entities: R[]; totalCount: number }> {
    const entitiesFromDB = await mongoDBRepository.get<T>(collection, settings);

    const totalCount: number = await this.getTotalCount(collection, settings.query);

    return { entities: mapIdFieldInArray(entitiesFromDB, fieldsToRemove), totalCount };
  }

  async getTotalCount<T extends Document>(collection: Collection<T>, filters?: Filter<T>): Promise<number> {
    return await mongoDBRepository.getTotalCount<T>(collection, filters);
  }
}

export const mapperRepository = new MapperRepository();
