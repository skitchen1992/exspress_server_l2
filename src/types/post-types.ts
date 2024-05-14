export type PostDbType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
};

export type GetPostsQuery = {
  /**
   * sortBy key
   */
  sortBy?: string;
  /**
   * Default value: desc
   */
  sortDirection?: 'asc' | 'desc';
  /**
   * pageNumber is number of portions that should be returned
   */
  pageNumber?: string;
  /**
   * pageSize is portions size that should be returned
   */
  pageSize?: string;
};
