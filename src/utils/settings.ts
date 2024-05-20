import { config } from 'dotenv';

config(); // добавление переменных из файла .env в process.env

export const SETTINGS = {
  PORT: process.env.PORT,
  ADMIN_AUTH_USERNAME: process.env.ADMIN_AUTH_USERNAME,
  ADMIN_AUTH_PASSWORD: process.env.ADMIN_AUTH_PASSWORD,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  DB: {
    NAME: {
      PORTAL: 'portal',
    },
    COLLECTION: {
      BLOGS: 'blogs',
      POSTS: 'posts',
      USERS: 'users',
      COMMENTS: 'comments',
    },
  },
};
