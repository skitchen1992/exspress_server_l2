import { addVisitRecordService } from '../../src/services/add-visit-record-service';
import TestAgent from 'supertest/lib/agent';
import { agent, Test } from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDb, db, documentsCollection } from '../../src/db/collection';
import { app } from '../../src/app';
import { testSeeder } from '../test.seeder';
import { ResultStatus } from '../../src/types/common/result';

let req: TestAgent<Test>;
let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await connectToDb(mongoServer.getUri());

  req = agent(app);

  await db.dropDatabase();
});

beforeEach(async () => {
  await db.dropDatabase();
});

afterAll(async () => {
  await db.dropDatabase();
  await mongoServer.stop();
});

describe('addVisitRecordService', () => {
  it(`Should get ${ResultStatus.BagRequest} if totalCount is greater than 5`, async () => {
    await documentsCollection.insertMany(testSeeder.createDocumentsListDto(5));

    const result = await addVisitRecordService('1', 'url');

    expect(result).toEqual({ status: ResultStatus.BagRequest, data: null });
  });

  it(`Should get ${ResultStatus.Success} if totalCount is greater than 5`, async () => {
    await documentsCollection.insertMany(testSeeder.createDocumentsListDto(1));

    const result = await addVisitRecordService('1', 'url');

    expect(result.status).toEqual(ResultStatus.Success);
  });
});
