import { PostBlogSchema, PostPostsSchema } from '../../src/models';

export const dataSetNewPost: PostPostsSchema = {
  title: "Title",
  shortDescription: "ShortDescription",
  content: "Content",
  blogId: "",
};

export const dataSetNewBlog: PostBlogSchema = {
  name: 'Test',
  description: 'Test description',
  websiteUrl: 'https://string.com',
};

export const dataSetUpdateBlog = {
  name: 'New test',
  description: 'New Test description',
  websiteUrl: 'https://string.ru',
};

export const dataSetNewBlog1 = {
  name: 'Test very long string in the world',
  description: 'Test description',
  websiteUrl: 'https://string.com',
};

export const errorDataSet1 = {
  errorsMessages: [
    {
      message: 'Max length 15',
      field: 'name',
    },
  ],
};

