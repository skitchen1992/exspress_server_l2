import { createAuthorizationHeader, req } from '../../test-helpers';
import { db } from '../../../src/db/db';
import { HTTP_STATUSES, PATH_URL } from '../../../src/utils/consts';
import * as data from './datasets';
import { SETTINGS } from '../../../src/utils/settings';

describe(`Endpoint (GET) - ${PATH_URL.BLOGS}`, () => {
  beforeEach(async () => {
    db.clearDB();
  });

  it('Should get empty array', async () => {
    const res = await req.get(PATH_URL.BLOGS).expect(HTTP_STATUSES.OK_200);

    expect(res.body.length).toBe(0);
  });

  it('Should get not empty array', async () => {
    await db.addBlog(data.dataSetNewBlog);

    const res = await req.get(PATH_URL.BLOGS).expect(HTTP_STATUSES.OK_200);

    const blog = await db.getBlogById(res.body.at(-1).id);

    expect(res.body.length).toBe(1);
    expect(res.body).toEqual([blog]);
  });
});

describe(`Endpoint (GET) by ID - ${PATH_URL.BLOGS}${PATH_URL.ID}`, () => {
  beforeEach(async () => {
    db.clearDB();
  });

  it('Should get blog', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    const res = await req.get(`${PATH_URL.BLOGS}/${id}`).expect(HTTP_STATUSES.OK_200);

    expect(res.body).toEqual(expect.objectContaining(data.dataSetNewBlog));
  });

  it(`Should get status ${HTTP_STATUSES.NOT_FOUND_404}`, async () => {
    await db.addBlog(data.dataSetNewBlog);

    await req.get(`${PATH_URL.BLOGS}/1`).expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});

describe(`Endpoint (POST) - ${PATH_URL.BLOGS}`, () => {
  beforeEach(async () => {
    db.clearDB();
  });

  it('Should add blog', async () => {
    const res = await req.post(PATH_URL.BLOGS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog).expect(HTTP_STATUSES.CREATED_201);

    expect(res.body).toEqual(expect.objectContaining(data.dataSetNewBlog));

    const dbRes = await db.getBlogById(res.body.id);

    expect(dbRes).toEqual(expect.objectContaining(data.dataSetNewBlog));
  });

  it('Should get Error while field "name" is too long', async () => {
    const res = await req.post(PATH_URL.BLOGS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog1).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet1);
  });

  it('Should get Error while field "name" is not a string', async () => {
    const res = await req.post(PATH_URL.BLOGS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog2).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet2);
  });

  it('Should get Error while field "name" is empty', async () => {
    const res = await req.post(PATH_URL.BLOGS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog3).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet3);
  });

  it('Should get Error while field "description" is too long', async () => {
    const res = await req.post(PATH_URL.BLOGS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog4).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet4);
  });

  it('Should get Error while field "description" is not a string', async () => {
    const res = await req.post(PATH_URL.BLOGS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog5).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet5);
  });

  it('Should get Error while field "description" is empty', async () => {
    const res = await req.post(PATH_URL.BLOGS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog6).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet6);
  });

  it('Should get Error while field "websiteUrl" is not correct', async () => {
    const res = await req.post(PATH_URL.BLOGS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog7).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet7);
  });
//skip for tests
  it.skip('Should get Error while we add too many fields specified', async () => {
    const res = await req.post(PATH_URL.BLOGS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog8).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet8);
  });
});

describe(`Endpoint (PUT) - ${PATH_URL.BLOGS}${PATH_URL.ID}`, () => {
  beforeEach(async () => {
    db.clearDB();
  });

  it('Should update blog', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    await req.put(`${PATH_URL.BLOGS}/${id}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetUpdateBlog).expect(HTTP_STATUSES.NO_CONTENT_204);

    const blog = await db.getBlogById(id);

    expect(blog).toEqual(expect.objectContaining(data.dataSetUpdateBlog));
  });

  it(`Should get error ${HTTP_STATUSES.NOT_FOUND_404}`, async () => {

    await req.put(`${PATH_URL.BLOGS}/1`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetUpdateBlog).expect(HTTP_STATUSES.NOT_FOUND_404);
  });

  it('Should get Error while field "name" is too long', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    const res = await req.put(`${PATH_URL.BLOGS}/${id}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog1).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet1);
  });

  it('Should get Error while field "name" is not a string', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    const res = await req.put(`${PATH_URL.BLOGS}/${id}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog2).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet2);
  });

  it('Should get Error while field "name" is empty', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    const res = await req.put(`${PATH_URL.BLOGS}/${id}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog3).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet3);
  });

  it('Should get Error while field "description" is too long', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    const res = await req.put(`${PATH_URL.BLOGS}/${id}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog4).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet4);
  });

  it('Should get Error while field "description" is not a string', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    const res = await req.put(`${PATH_URL.BLOGS}/${id}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog5).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet5);
  });

  it('Should get Error while field "description" is empty', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    const res = await req.put(`${PATH_URL.BLOGS}/${id}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog6).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet6);
  });

  it('Should get Error while field "websiteUrl" is not correct', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    const res = await req.put(`${PATH_URL.BLOGS}/${id}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog7).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet7);
  });
//skip for tests
  it.skip('Should get Error while we add too many fields specified', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    const res = await req.put(`${PATH_URL.BLOGS}/${id}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send(data.dataSetNewBlog8).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet8);
  });
});

describe(`Endpoint (DELETE) - ${PATH_URL.BLOGS}${PATH_URL.ID}`, () => {
  beforeEach(async () => {
    db.clearDB();
  });

  it('Should delete blog', async () => {
    const id = await db.addBlog(data.dataSetNewBlog);

    await req.delete(`${PATH_URL.BLOGS}/${id}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .expect(HTTP_STATUSES.NO_CONTENT_204);
  });

  it(`Should get error ${HTTP_STATUSES.NOT_FOUND_404}`, async () => {

    await req.delete(`${PATH_URL.BLOGS}/1`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .expect(HTTP_STATUSES.NOT_FOUND_404);
  });
});
