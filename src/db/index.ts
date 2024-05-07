import { Collection, Db, MongoClient } from 'mongodb';
import { BlogDbType } from '../types/blog_types';
import { SETTINGS } from '../utils/settings';

let client: MongoClient = {} as MongoClient;
export let db: Db = {} as Db;

export let blogsCollection: Collection<BlogDbType>;

export const connectToDb = async (mongoUrl: string): Promise<boolean> => {
  try {
    client = new MongoClient(mongoUrl);

    db = client.db(SETTINGS.DB.NAME.PORTAL);

    blogsCollection = db.collection<BlogDbType>(SETTINGS.DB.COLLECTION.BLOGS);

    await client.connect();

    return true;
  } catch (e) {
    await client.close();
    return false;
  }
};
