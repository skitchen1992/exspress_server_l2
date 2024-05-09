import { Collection, Db, MongoClient } from 'mongodb';
import { BlogDbType } from '../types/blog_types';
import { SETTINGS } from '../utils/settings';
import { PostDbType } from '../types/post-types';

let client: MongoClient;
export let db: Db;

export let blogsCollection: Collection<BlogDbType>;
export let postsCollection: Collection<PostDbType>;

export const connectToDb = async (mongoUrl: string): Promise<boolean> => {
  try {
    client = new MongoClient(mongoUrl);

    db = client.db(SETTINGS.DB.NAME.PORTAL);

    blogsCollection = db.collection<BlogDbType>(SETTINGS.DB.COLLECTION.BLOGS);
    postsCollection = db.collection<PostDbType>(SETTINGS.DB.COLLECTION.POSTS);

    await client.connect();

    return true;
  } catch (e) {
    await client.close();
    return false;
  }
};
