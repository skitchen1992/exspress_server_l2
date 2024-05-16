import { HTTP_STATUSES, PATH_URL } from '../../../src/utils/consts';
import TestAgent from 'supertest/lib/agent';
import { agent, Test } from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { blogsCollection, connectToDb, postsCollection, usersCollection } from '../../../src/db';
import { app } from '../../../src/app';
import { mongoDBRepository } from '../../../src/repositories/db-repository';
import { UserDbType } from '../../../src/types/users-types';
import { createAuthorizationHeader } from '../../test-helpers';
import { SETTINGS } from '../../../src/utils/settings';
import * as data from '../users/datasets';

describe(`Endpoint (GET) - ${PATH_URL.USERS}`, () => {
  let req: TestAgent<Test>;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectToDb(mongoServer.getUri());

    req = agent(app);

    await blogsCollection.deleteMany();
    await postsCollection.deleteMany();
    await usersCollection.deleteMany();
  });

  afterEach(async () => {
    await mongoServer.stop();
  });

  it('Should get empty array', async () => {
    const res = await req.get(PATH_URL.USERS).expect(HTTP_STATUSES.OK_200);

    expect(res.body.items.length).toBe(0);
  });

  it('Should get not empty array', async () => {
    const createdAt = new Date().toISOString();

    const { insertedId } = await mongoDBRepository.add<UserDbType>(usersCollection, {
      login: 'T8ksjEq-LV',
      password: 'string',
      email: 'example@example.com',
      createdAt,
    });

    const res = await req.get(PATH_URL.USERS).expect(HTTP_STATUSES.OK_200);

    expect(res.body.items.length).toBe(1);

    expect(res.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: insertedId.toString(),
          login: 'T8ksjEq-LV',
          email: 'example@example.com',
          createdAt,
        },
      ],
    });
  });

  it('Should get second page', async () => {
    const firstUserCreatedAt = new Date().toISOString();

    await mongoDBRepository.add<UserDbType>(usersCollection, {
      login: 'Login Nik',
      password: 'string',
      email: '1@example.com',
      createdAt: firstUserCreatedAt,
    });

    const secondUserCreatedAt = new Date().toISOString();

    const secondUser = await mongoDBRepository.add<UserDbType>(usersCollection, {
      login: 'Login Pig',
      password: 'string',
      email: '2@example.com',
      createdAt: secondUserCreatedAt,
    });

    const res = await req.get(`${PATH_URL.USERS}/?pageSize=1&pageNumber=1`).expect(HTTP_STATUSES.OK_200);

    expect(res.body.items.length).toBe(1);

    expect(res.body).toEqual({
      pagesCount: 2,
      page: 1,
      pageSize: 1,
      totalCount: 2,
      items: [
        {
          id: secondUser.insertedId.toString(),
          login: 'Login Pig',
          email: '2@example.com',
          createdAt: secondUserCreatedAt,
        },
      ],
    });
  });

  it('Should find user by login', async () => {
    const firstUserCreatedAt = new Date().toISOString();

    await mongoDBRepository.add<UserDbType>(usersCollection, {
      login: 'Login Nik',
      password: 'string',
      email: '1@example.com',
      createdAt: firstUserCreatedAt,
    });

    const secondUserCreatedAt = new Date().toISOString();

    const secondUser = await mongoDBRepository.add<UserDbType>(usersCollection, {
      login: 'Login Pig',
      password: 'string',
      email: '2@example.com',
      createdAt: secondUserCreatedAt,
    });

    const res = await req.get(`${PATH_URL.USERS}/?searchLoginTerm=Pig`).expect(HTTP_STATUSES.OK_200);

    expect(res.body.items.length).toBe(1);

    expect(res.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: secondUser.insertedId.toString(),
          login: 'Login Pig',
          email: '2@example.com',
          createdAt: secondUserCreatedAt,
        },
      ],
    });
  });

  it('Should find user by email', async () => {
    const firstUserCreatedAt = new Date().toISOString();

    await mongoDBRepository.add<UserDbType>(usersCollection, {
      login: 'Login Nik',
      password: 'string',
      email: 'test@example.com',
      createdAt: firstUserCreatedAt,
    });

    const secondUserCreatedAt = new Date().toISOString();

    const secondUser = await mongoDBRepository.add<UserDbType>(usersCollection, {
      login: 'Login Pig',
      password: 'string',
      email: 'unio@example.com',
      createdAt: secondUserCreatedAt,
    });

    const res = await req.get(`${PATH_URL.USERS}/?searchEmailTerm=unio@example.com`).expect(HTTP_STATUSES.OK_200);

    expect(res.body.items.length).toBe(1);

    expect(res.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        {
          id: secondUser.insertedId.toString(),
          login: 'Login Pig',
          email: 'unio@example.com',
          createdAt: secondUserCreatedAt,
        },
      ],
    });
  });
});

describe(`Endpoint (POST) - ${PATH_URL.USERS}`, () => {
  let req: TestAgent<Test>;

  beforeAll(async () => {
    const server = await MongoMemoryServer.create();
    await connectToDb(server.getUri());

    req = agent(app);

    await blogsCollection.deleteMany();
    await postsCollection.deleteMany();
    await usersCollection.deleteMany();
  });

  it('Should add user', async () => {
    const res = await req
      .post(PATH_URL.USERS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({
        login: 'yqORsIlX-V',
        password: 'string',
        email: 'example@example.com',
      })
      .expect(HTTP_STATUSES.CREATED_201);

    expect(res.body).toEqual(
      expect.objectContaining({
        login: 'yqORsIlX-V',
        email: 'example@example.com',
      })
    );

    const dbRes = await mongoDBRepository.getById<UserDbType>(usersCollection, res.body.id);

    expect(dbRes).toEqual(
      expect.objectContaining({
        login: 'yqORsIlX-V',
        email: 'example@example.com',
      })
    );
  });

  it('Should get Error while field "login" is too long', async () => {
    const res = await req
      .post(PATH_URL.USERS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewUser1)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet1);
  });

  it('Should get Error while field "password" is too long', async () => {
    const res = await req
      .post(PATH_URL.USERS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewUser2)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet2);
  });

  it('Should get Error while field "email" is not correct', async () => {
    const res = await req
      .post(PATH_URL.USERS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewUser3)
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet3);
  });
});
