import express from 'express';
import cors from 'cors';
import { HTTP_STATUSES, PATH_URL } from './utils/consts';
import { blogsRouter } from './routers/blogs-router';
import { postsRouter } from './routers/posts-router';
import { testingRouter } from './routers/testing-router';

export const app = express();

app.use(express.json());
app.use(cors());

app.get(PATH_URL.ROOT, (req, res) => {
  res.status(HTTP_STATUSES.OK_200).json({ version: '1.0' });
});

app.use(PATH_URL.BLOGS, blogsRouter);

app.use(PATH_URL.POSTS, postsRouter);

app.use(PATH_URL.TESTING.ROOT, testingRouter);
