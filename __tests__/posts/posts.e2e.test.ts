import { createAuthorizationHeader, req } from '../test-helpers';
import { db } from '../../src/db/db';
import { HTTP_STATUSES, PATH_URL } from '../../src/utils/consts';
import * as data from './datasets';
import { SETTINGS } from '../../src/utils/settings';
import { dataSetNewPost1, dataSetUpdatePost } from './datasets';


describe(`Endpoint (GET) - ${PATH_URL.POSTS}`, () => {
  beforeEach(async () => {
    db.clearDB();
  });

  it('Should get empty array', async () => {
    const res = await req.get(PATH_URL.POSTS).expect(HTTP_STATUSES.OK_200);

    expect(res.body.length).toBe(0);
  });

  it('Should get not empty array', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.get(PATH_URL.POSTS).expect(HTTP_STATUSES.OK_200);

    const post = await db.getPostById(res.body.at(-1).id);

    expect(res.body.length).toBe(1);
    expect(res.body).toEqual([post]);
  });
});

describe(`Endpoint (GET) by ID - ${PATH_URL.POSTS}${PATH_URL.ID}`, () => {
  beforeEach(async () => {
    db.clearDB();
  });

  it('Should get a post', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.get(`${PATH_URL.POSTS}/${postId}`).expect(HTTP_STATUSES.OK_200);

    expect(res.body).toEqual(expect.objectContaining({ ...data.dataSetNewPost, id: postId, blogId }));
  });

  it(`Should get status ${HTTP_STATUSES.NOT_FOUND_404}`, async () => {
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId: '1' });

    if (!Number(postId)) {
      await req.get(`${PATH_URL.POSTS}/1`).expect(HTTP_STATUSES.NOT_FOUND_404);
    }
  });
});

describe(`Endpoint (POST) - ${PATH_URL.POSTS}`, () => {
  beforeEach(async () => {
    db.clearDB();
  });

  it('Should add post', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const blog = await db.getBlogById(blogId);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost, blogId }).expect(HTTP_STATUSES.CREATED_201);

    expect(res.body).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId, blogName: blog!.name }));

    const post = await db.getPostById(res.body.id);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });

  it('Should get Error while field "title" is too long', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost1, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet1);
  });

  it('Should get Error while field "title" is not a string', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost2, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet2);
  });

  it('Should get Error while field "title" is empty', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost3, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet3);
  });

  it('Should get Error while field "shortDescription" is too long', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost4, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet4);
  });

  it('Should get Error while field "shortDescription" is not a string', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost5, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet5);
  });

  it('Should get Error while field "description" is empty', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost6, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet6);
  });

  it('Should get Error while field "content" is too long', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost7, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet7);
  });

  it('Should get Error while field "content" is not a string', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost8, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet8);
  });

  it.skip('Should get Error while field "content" is empty', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost9, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet9);
  });

//skip for tests
  it.skip('Should get Error while we add too many fields specified', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);

    const res = await req.post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost10, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet10);
  });
});

describe(`Endpoint (PUT) - ${PATH_URL.POSTS}${PATH_URL.ID}`, () => {
  beforeEach(async () => {
    db.clearDB();
  });

  it('Should update post', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetUpdatePost, blogId }).expect(HTTP_STATUSES.NO_CONTENT_204);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetUpdatePost, blogId }));
  });

  it('Should get Error while field "title" is too long', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost1, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet1);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });

  it('Should get Error while field "title" is not a string', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost2, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet2);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });

  it('Should get Error while field "title" is empty', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost3, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet3);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });

  it('Should get Error while field "shortDescription" is too long', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost4, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet4);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });

  it('Should get Error while field "shortDescription" is not a string', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost5, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet5);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });

  it('Should get Error while field "description" is empty', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost6, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet6);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });

  it('Should get Error while field "content" is too long', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost7, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet7);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });

  it('Should get Error while field "content" is not a string', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost8, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet8);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });

  it.skip('Should get Error while field "content" is empty', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost9, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet9);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });

  it('Should get Error while we add too many fields specified', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    const res = await req.put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost10, blogId }).expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet10);

    const post = await db.getPostById(postId);

    expect(post).toEqual(expect.objectContaining({ ...data.dataSetNewPost, blogId }));
  });
});

describe(`Endpoint (DELETE) - ${PATH_URL.POSTS}${PATH_URL.ID}`, () => {
  beforeEach(async () => {
    db.clearDB();
  });

  it('Should delete post', async () => {
    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    await req.delete(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const post = await db.getPostById(postId);
    expect(post).toBe(null);
  });

  it(`Should get error ${HTTP_STATUSES.NOT_FOUND_404}`, async () => {

    const blogId = await db.addBlog(data.dataSetNewBlog);
    const postId = await db.addPost({ ...data.dataSetNewPost, blogId });

    await req.delete(`${PATH_URL.POSTS}/1`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    const post = await db.getPostById(postId);
    expect(Boolean(post)).toBe(true);
  });
});
