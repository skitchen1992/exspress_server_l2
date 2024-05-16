import { RequestWithBody } from '../types/request-types';
import { CreateBlogSchema, GetBlogSchema } from '../models';
import { mongoDBRepository } from '../repositories/db-repository';
import { BlogDbType } from '../types/blog-types';
import { blogsCollection } from '../db';
import { queryRepository } from '../repositories/queryRepository';

export const createBlogService = async (req: RequestWithBody<CreateBlogSchema>) => {
  const newBlog: BlogDbType = {
    name: req.body.name,
    description: req.body.description,
    websiteUrl: req.body.websiteUrl,
    createdAt: new Date().toISOString(),
    isMembership: false,
  };

  const { insertedId } = await mongoDBRepository.add<BlogDbType>(blogsCollection, newBlog);

  const blog = await queryRepository.findEntityAndMapIdField<BlogDbType, GetBlogSchema>(
    blogsCollection,
    insertedId.toString()
  );

  if (blog) {
    return blog;
  } else {
    return null;
  }
};
