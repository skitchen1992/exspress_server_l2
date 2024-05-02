import { app } from '../src/app';
import { agent } from 'supertest';

export const req = agent(app);

export const createAuthorizationHeader = (username?: string, password?: string) => {
  const credentials = btoa(`${username}:${password}`);

  return {
    Authorization: `Basic ${credentials}`,
  };
};
