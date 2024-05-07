import {
  Collection,
  DeleteResult,
  Filter,
  InsertOneResult,
  MatchKeysAndValues,
  ObjectId,
  OptionalUnlessRequiredId,
  UpdateResult,
  WithId,
} from 'mongodb';
import { Document } from 'bson';

abstract class Database {
  abstract get<T extends Document>(collection: Collection<T>): Promise<WithId<T>[]>;

  abstract getById<T extends Document>(collection: Collection<T>, id: string): Promise<WithId<T> | null>;

  abstract add<T extends Document>(
    collection: Collection<T>,
    data: OptionalUnlessRequiredId<T>
  ): Promise<InsertOneResult<T>>;

  abstract update<T extends Document>(
    collection: Collection<T>,
    id: string,
    data: MatchKeysAndValues<T>
  ): Promise<UpdateResult<T>>;

  abstract delete<T extends Document>(collection: Collection<T>, id: string): Promise<DeleteResult>;
}

export class MongoDB extends Database {
  public async get<T extends Document>(collection: Collection<T>, params = {}): Promise<WithId<T>[]> {
    return collection.find(params).toArray();
  }

  public async getById<T extends Document>(collection: Collection<T>, id: string): Promise<WithId<T> | null> {
    const filter = { _id: new ObjectId(id) } as Filter<T>;

    return collection.findOne(filter);
  }

  public async add<T extends Document>(
    collection: Collection<T>,
    data: OptionalUnlessRequiredId<T>
  ): Promise<InsertOneResult<T>> {
    return collection.insertOne(data);
  }

  public async update<T extends Document>(
    collection: Collection<T>,
    id: string,
    data: MatchKeysAndValues<T>
  ): Promise<UpdateResult<T>> {
    const filter = { _id: new ObjectId(id) } as Filter<T>;
    return await collection.updateOne(filter, { $set: data });
  }

  public async delete<T extends Document>(collection: Collection<T>, id: string): Promise<DeleteResult> {
    const filter = { _id: new ObjectId(id) } as Filter<T>;
    return await collection.deleteOne(filter);
  }
}

export const mongoDB = new MongoDB();
