import { config } from 'dotenv';

config(); // добавление переменных из файла .env в process.env

export const SETTINGS = {
  PORT: process.env.PORT,
  ADMIN_AUTH_USERNAME: process.env.ADMIN_AUTH_USERNAME,
  ADMIN_AUTH_PASSWORD: process.env.ADMIN_AUTH_PASSWORD,
};
