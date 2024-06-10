import { Collection, Db, MongoClient } from 'mongodb';
import { BlogDbType } from '../types/blog-types';
import { SETTINGS } from '../utils/settings';
import { PostDbType } from '../types/post-types';
import { UserDbType } from '../types/users-types';
import { CommentDbType } from '../types/comments-types';
import { TokenDbType } from '../types/tokens-types';

let client: MongoClient;
export let db: Db;

export let blogsCollection: Collection<BlogDbType>;
export let postsCollection: Collection<PostDbType>;
export let usersCollection: Collection<UserDbType>;
export let commentsCollection: Collection<CommentDbType>;
export let tokensCollection: Collection<TokenDbType>;

export const connectToDb = async (mongoUrl: string): Promise<boolean> => {
  try {
    client = new MongoClient(mongoUrl);

    db = client.db(SETTINGS.DB.NAME.PORTAL);

    blogsCollection = db.collection<BlogDbType>(SETTINGS.DB.COLLECTION.BLOGS);
    postsCollection = db.collection<PostDbType>(SETTINGS.DB.COLLECTION.POSTS);
    usersCollection = db.collection<UserDbType>(SETTINGS.DB.COLLECTION.USERS);
    commentsCollection = db.collection<CommentDbType>(SETTINGS.DB.COLLECTION.COMMENTS);
    tokensCollection = db.collection<TokenDbType>(SETTINGS.DB.COLLECTION.TOKENS);

    await client.connect();

    return true;
  } catch (e) {
    await client.close();
    return false;
  }
};
