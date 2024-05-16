import { createAuthorizationHeader } from '../../test-helpers';
import { HTTP_STATUSES, PATH_URL } from '../../../src/utils/consts';
import * as data from './datasets';
import { SETTINGS } from '../../../src/utils/settings';
import { agent, Test } from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { blogsCollection, connectToDb, postsCollection } from '../../../src/db';
import { app } from '../../../src/app';
import TestAgent from 'supertest/lib/agent';
import { mongoDBRepository } from '../../../src/repositories/db-repository';
import { BlogDbType } from '../../../src/types/blog-types';
import { PostDbType } from '../../../src/types/post-types';
import { ID } from './datasets';

describe(`Endpoint (GET) - ${PATH_URL.POSTS}`, () => {
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
    const res = await req.get(PATH_URL.POSTS).expect(HTTP_STATUSES.OK_200);

    expect(res.body.items.length).toBe(0);
  });

  it('Should get not empty array', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req.get(PATH_URL.POSTS).expect(HTTP_STATUSES.OK_200);

    expect(res.body.items.length).toBe(1);

    expect(res.body).toEqual({
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 1,
      items: [
        expect.objectContaining({
          blogId: blogId.toString(),
          blogName: blog!.name,
          content: 'Content',
          createdAt,
          id: postId.toString(),
          shortDescription: 'ShortDescription',
          title: 'Title',
        }),
      ],
    });
  });

  it('Should get second page', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    await postsCollection.insertMany([
      {
        title: 'Nikita',
        shortDescription: 'ShortDescription',
        content: 'Content',
        blogId: blogId.toString(),
        blogName: blog!.name,
        createdAt,
      },
      {
        title: 'Dasha',
        shortDescription: 'ShortDescription',
        content: 'Content',
        blogId: blogId.toString(),
        blogName: blog!.name,
        createdAt,
      },
      {
        title: 'Tatiana',
        shortDescription: 'ShortDescription',
        content: 'Content',
        blogId: blogId.toString(),
        blogName: blog!.name,
        createdAt,
      },
    ]);

    const res = await req.get(`${PATH_URL.POSTS}/?pageNumber=2&pageSize=2`).expect(HTTP_STATUSES.OK_200);

    expect(res.body.items.length).toBe(1);

    expect(res.body).toEqual({
      pagesCount: 2,
      page: 2,
      pageSize: 2,
      totalCount: 3,
      items: [
        expect.objectContaining({
          blogId: blogId.toString(),
          blogName: blog!.name,
          content: 'Content',
          createdAt,
          shortDescription: 'ShortDescription',
          title: 'Tatiana',
        }),
      ],
    });
  });
});

describe(`Endpoint (GET) by ID - ${PATH_URL.POSTS}${PATH_URL.ID}`, () => {
  let req: TestAgent<Test>;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectToDb(mongoServer.getUri());

    req = agent(app);

    await blogsCollection.deleteMany();
    await postsCollection.deleteMany();
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it('Should get a post', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req.get(`${PATH_URL.POSTS}/${postId}`).expect(HTTP_STATUSES.OK_200);

    expect(res.body).toEqual(
      expect.objectContaining({
        blogId: blogId.toString(),
        blogName: blog!.name,
        content: 'Content',
        createdAt,
        id: postId.toString(),
        shortDescription: 'ShortDescription',
        title: 'Title',
      })
    );
  });

  it(`Should get status ${HTTP_STATUSES.NOT_FOUND_404}`, async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    if (!Number(postId)) {
      await req.get(`${PATH_URL.POSTS}/${ID}`).expect(HTTP_STATUSES.NOT_FOUND_404);
    }
  });
});

describe(`Endpoint (POST) - ${PATH_URL.POSTS}`, () => {
  let req: TestAgent<Test>;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectToDb(mongoServer.getUri());

    req = agent(app);

    await blogsCollection.deleteMany();
    await postsCollection.deleteMany();
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it('Should add post', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost0, blogId })
      .expect(HTTP_STATUSES.CREATED_201);

    expect(res.body).toEqual(
      expect.objectContaining({ ...data.dataSetNewPost0, blogId: blogId.toString(), blogName: blog!.name })
    );
  });

  it('Should get error while blog not found', async () => {
    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost0, blogId: ID })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual({
      errorsMessages: [
        {
          message: 'Blog is not founded',
          field: 'blogId',
        },
      ],
    });
  });

  it('Should get Error while field "title" is too long', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost1, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet1);
  });

  it('Should get Error while field "title" is not a string', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost2, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet2);
  });

  it('Should get Error while field "title" is empty', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost3, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet3);
  });

  it('Should get Error while field "shortDescription" is too long', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost4, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet4);
  });

  it('Should get Error while field "shortDescription" is not a string', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost5, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet5);
  });

  it('Should get Error while field "description" is empty', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost6, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet6);
  });

  it('Should get Error while field "content" is too long', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost7, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet7);
  });

  it('Should get Error while field "content" is not a string', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost8, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet8);
  });

  it.skip('Should get Error while field "content" is empty', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost9, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet9);
  });

  //skip for tests
  it.skip('Should get Error while we add too many fields specified', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const res = await req
      .post(PATH_URL.POSTS)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost10, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet10);
  });
});

describe(`Endpoint (PUT) - ${PATH_URL.POSTS}${PATH_URL.ID}`, () => {
  let req: TestAgent<Test>;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectToDb(mongoServer.getUri());

    req = agent(app);

    await blogsCollection.deleteMany();
    await postsCollection.deleteMany();
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it('Should update post', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    await req
      .put(`${PATH_URL.POSTS}/${postId.toString()}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetUpdatePost, blogId: blogId.toString() })
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const post = await mongoDBRepository.getById<PostDbType>(postsCollection, postId.toString());

    expect(post).toEqual(
      expect.objectContaining({ ...data.dataSetUpdatePost, blogId: blogId.toString(), blogName: blog!.name })
    );
  });

  it('Should get Error while field "title" is too long', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req
      .put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost1, blogId })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet1);
  });

  it('Should get Error while field "title" is not a string', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req
      .put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost2, blogId })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet2);
  });

  it('Should get Error while field "title" is empty', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;
    const res = await req
      .put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost3, blogId })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet3);
  });

  it('Should get Error while field "shortDescription" is too long', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req
      .put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost4, blogId })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet4);
  });

  it('Should get Error while field "shortDescription" is not a string', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req
      .put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost5, blogId })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet5);
  });

  it('Should get Error while field "description" is empty', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req
      .put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost6, blogId })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet6);
  });

  it('Should get Error while field "content" is too long', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req
      .put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost7, blogId })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet7);
  });

  it('Should get Error while field "content" is not a string', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req
      .put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost8, blogId })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet8);
  });

  it.skip('Should get Error while field "content" is empty', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req
      .put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost9, blogId })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet9);
  });

  it('Should get Error while we add too many fields specified', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    const res = await req
      .put(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .send({ ...data.dataSetNewPost10, blogId })
      .expect(HTTP_STATUSES.BAD_REQUEST_400);

    expect(res.body).toEqual(data.errorDataSet10);
  });
});

describe(`Endpoint (DELETE) - ${PATH_URL.POSTS}${PATH_URL.ID}`, () => {
  let req: TestAgent<Test>;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    mongoServer = await MongoMemoryServer.create();
    await connectToDb(mongoServer.getUri());

    req = agent(app);

    await blogsCollection.deleteMany();
    await postsCollection.deleteMany();
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it('Should delete post', async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    await req
      .delete(`${PATH_URL.POSTS}/${postId}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .expect(HTTP_STATUSES.NO_CONTENT_204);

    const post = await mongoDBRepository.getById<PostDbType>(postsCollection, postId.toString());

    expect(post).toBe(null);
  });

  it(`Should get error ${HTTP_STATUSES.NOT_FOUND_404}`, async () => {
    const insertOneResultBlog = await mongoDBRepository.add<BlogDbType>(blogsCollection, data.dataSetNewBlog);

    const { insertedId: blogId } = insertOneResultBlog;

    const blog = await mongoDBRepository.getById<BlogDbType>(blogsCollection, blogId.toString());

    const createdAt = new Date().toISOString();

    const insertOneResultPost = await mongoDBRepository.add<PostDbType>(postsCollection, {
      ...data.dataSetNewPost,
      blogId: blogId.toString(),
      blogName: blog!.name,
      createdAt,
    });

    const { insertedId: postId } = insertOneResultPost;

    await req
      .delete(`${PATH_URL.POSTS}/${ID}`)
      .set(createAuthorizationHeader(SETTINGS.ADMIN_AUTH_USERNAME, SETTINGS.ADMIN_AUTH_PASSWORD))
      .expect(HTTP_STATUSES.NOT_FOUND_404);

    const post = await mongoDBRepository.getById<PostDbType>(postsCollection, postId.toString());
    expect(Boolean(post)).toBe(true);
  });
});
