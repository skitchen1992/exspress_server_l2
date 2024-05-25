import { HTTP_STATUSES, PATH_URL } from '../../../src/utils/consts';
import TestAgent from 'supertest/lib/agent';
import { agent, Test } from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDb, usersCollection } from '../../../src/db/collection';
import { app } from '../../../src/app';
import { createAuthorizationHeader } from '../../test-helpers';
import { SETTINGS } from '../../../src/utils/settings';

describe(`Endpoint (POST) - ${PATH_URL.AUTH}`, () => {
  let req: TestAgent<Test>;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectToDb(mongoServer.getUri());

    req = agent(app);

    await usersCollection.deleteMany();
  });

  afterEach(async () => {
    await usersCollection.deleteMany();
  });

  it(`Should get status ${HTTP_STATUSES.NO_CONTENT_204}`, async () => {
    await req
      .post(PATH_URL.USERS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({
        login: 'login',
        password: 'password',
        email: 'example@example.com',
      })
      .expect(HTTP_STATUSES.CREATED_201);

    await req
      .post(`${PATH_URL.AUTH.ROOT}${PATH_URL.AUTH.LOGIN}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({
        loginOrEmail: 'login',
        password: 'password',
      })
      .expect(HTTP_STATUSES.OK_200);
  });

  it(`Should get status ${HTTP_STATUSES.UNAUTHORIZED_401}`, async () => {
    await req
      .post(PATH_URL.USERS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({
        login: 'login',
        password: 'password',
        email: 'example@example.com',
      })
      .expect(HTTP_STATUSES.CREATED_201);

    await req
      .post(`${PATH_URL.AUTH.ROOT}${PATH_URL.AUTH.LOGIN}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({
        loginOrEmail: 'logi',
        password: 'password',
      })
      .expect(HTTP_STATUSES.UNAUTHORIZED_401);
  });

  it(`Should get status ${HTTP_STATUSES.BAD_REQUEST_400}`, async () => {
    await req
      .post(PATH_URL.USERS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({
        login: 'l',
        password: 'password',
        email: 'example@example.com',
      })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);
  });
});
