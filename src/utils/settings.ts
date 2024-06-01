import { config } from 'dotenv';

config(); // добавление переменных из файла .env в process.env

export const SETTINGS = {
  PORT: process.env.PORT,
  ADMIN_AUTH_USERNAME: process.env.ADMIN_AUTH_USERNAME,
  ADMIN_AUTH_PASSWORD: process.env.ADMIN_AUTH_PASSWORD,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  SECRET_KEY: process.env.SECRET_KEY,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || '1',
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,

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
