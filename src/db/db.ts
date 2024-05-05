import {
  GetBlogListSchema,
  GetBlogSchema,
  GetPostListSchema,
  GetPostSchema,
  CreateBlogSchema,
  CreatePostSchema,
  UpdateBlogSchema,
  UpdatePostSchema,
} from '../models';

export type DBType = {
  blogs: GetBlogListSchema;
  posts: GetPostListSchema;
};

const data_base: DBType = {
  blogs: [],
  posts: [],
};

class DB {
  private db: DBType;

  constructor() {
    this.db = data_base;
  }

  public async getBlogs(): Promise<GetBlogListSchema> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.db.blogs);
      }, 0);
    });
  }

  public async getPosts(): Promise<GetPostListSchema> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.db.posts);
      }, 0);
    });
  }

  public async getBlogById(id: string): Promise<GetBlogSchema | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.findIndex('blogs', id);

        if (index === -1) {
          resolve(null);
        } else {
          resolve(this.db.blogs[index]);
        }
      }, 0);
    });
  }

  public async getPostById(id: string): Promise<GetPostSchema | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.findIndex('posts', id);

        if (index === -1) {
          resolve(null);
        } else {
          resolve(this.db.posts[index]);
        }
      }, 0);
    });
  }

  public addBlog(data: CreateBlogSchema): Promise<string> {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const id = this.createId();
        const newData: GetBlogSchema = {
          ...data,
          id,
        };

        this.db.blogs.push(newData);
        resolve(id);
      }, 0);
    });
  }

  public async addPost(data: CreatePostSchema): Promise<string> {
    const id = this.createId();
    const blog = await this.getBlogById(data.blogId);

    return new Promise<string>((resolve) => {
      if (blog) {
        setTimeout(() => {
          const newData: GetPostSchema = {
            ...data,
            id,
            blogName: blog!.name,
            blogId: blog.id,
          };

          this.db.posts.push(newData);
          resolve(id);
        }, 0);
      } else {
        resolve('0');
      }
    });
  }

  public async updateBlog(id: string, data: UpdateBlogSchema): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const index = this.findIndex('blogs', id);

        if (index !== -1) {
          this.db.blogs[index] = {
            ...this.db.blogs[index],
            ...data,
          };
          resolve(true);
        } else {
          resolve(false);
        }
      }, 0);
    });
  }

  public async updatePost(id: string, data: UpdatePostSchema): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const index = this.findIndex('posts', id);

        if (index !== -1) {
          this.db.posts[index] = {
            ...this.db.posts[index],
            ...data,
          };
          resolve(true);
        } else {
          resolve(false);
        }
      }, 0);
    });
  }

  public async deleteBlog(id: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const index = this.findIndex('blogs', id);

        if (index !== -1) {
          this.db.blogs.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 0);
    });
  }

  public async deletePost(id: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const index = this.findIndex('posts', id);

        if (index !== -1) {
          this.db.posts.splice(index, 1);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 0);
    });
  }

  public findIndex(key: keyof DBType, id: string) {
    return this.db[key].findIndex((item) => item.id === id);
  }

  private createId() {
    return String(Date.now() + Math.random());
  }

  public clearDB() {
    this.db.posts = [];
    this.db.blogs = [];
  }
}

export const db = new DB();
