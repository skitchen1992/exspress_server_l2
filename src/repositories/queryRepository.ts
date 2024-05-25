import { GetQuerySettings, mongoDBRepository } from './db-repository';
import { Collection } from 'mongodb';
import { Document } from 'bson';
import { mapIdAndPassFieldsField, mapIdAndPassFieldsInArray, mapIdField, mapIdFieldInArray } from '../utils/map';

class QueryRepository {
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

    const totalCount: number = await this.getTotalCount(collection, settings);

    return { entities: mapIdFieldInArray(entitiesFromDB, fieldsToRemove), totalCount };
  }

  async findAndMapUser<T extends Document, R>(collection: Collection<T>, id: string): Promise<R | null> {
    const user = await mongoDBRepository.getById<T>(collection, id);

    return user ? mapIdAndPassFieldsField(user) : null;
  }

  async findAndMapUserList<T extends Document, R>(
    collection: Collection<T>,
    settings: GetQuerySettings
  ): Promise<{ userList: R[]; totalCount: number }> {
    const usersFromDB = await mongoDBRepository.get<T>(collection, settings);

    const totalCount: number = await this.getTotalCount(collection, settings);

    return { userList: mapIdAndPassFieldsInArray(usersFromDB), totalCount };
  }

  async getTotalCount<T extends Document, R>(collection: Collection<T>, settings: GetQuerySettings): Promise<number> {
    return await mongoDBRepository.getTotalCount(collection, settings.query);
  }
}

export const queryRepository = new QueryRepository();
