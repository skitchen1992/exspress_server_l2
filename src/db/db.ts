import {
  GetBlogListSchema,
  GetBlogSchema,
  GetPostsListSchema,
  GetPostsSchema,
  PostBlogSchema,
  PostPostsSchema, PutBlogSchema, PutPostsSchema,
} from '../models';

export type DBType = {
  blogs: GetBlogListSchema;
  posts: GetPostsListSchema;
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

  public addBlog(data: PostBlogSchema) {
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

  public updateBlog(id: string, data: PutBlogSchema) {
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

  public deleteBlog(id: string) {
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

  public async getPosts(): Promise<GetPostsListSchema> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.db.posts);
      }, 0);
    });
  }


  public getPostById(id: string) {
    const index = this.findIndex('posts', id);

    if (index === -1) {
      return null;
    } else {
      return this.db.posts[index];
    }
  }

  public addPost(data: PostPostsSchema) {
    const newData: GetPostsSchema = {
      ...data,
      id: this.createId(),

    };

    this.db.posts.push(newData);
  }

  public updatePost(id: string, data: PutPostsSchema) {
    const index = this.findIndex('posts', id);

    if (index !== -1) {
      this.db.posts[index] = {
        ...this.db.posts[index],
        ...data,
      };
      return true;
    } else {
      return false;
    }
  }

  public deletePost(id: string) {
    const index = this.findIndex('posts', id);

    if (index !== -1) {
      this.db.posts.splice(index, 1);
      return true;
    } else {
      return false;
    }
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
