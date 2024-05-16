import { HTTP_STATUSES, PATH_URL } from '../../../src/utils/consts';
import TestAgent from 'supertest/lib/agent';
import { agent, Test } from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { blogsCollection, connectToDb, postsCollection, usersCollection } from '../../../src/db';
import { app } from '../../../src/app';
import { mongoDBRepository } from '../../../src/repositories/db-repository';
import { UserDbType } from '../../../src/types/users-types';

describe(`Endpoint (GET) - ${PATH_URL.USERS}`, () => {
  let req: TestAgent<Test>;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectToDb(mongoServer.getUri());

    req = agent(app);

    await blogsCollection.deleteMany();
    await postsCollection.deleteMany();
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
