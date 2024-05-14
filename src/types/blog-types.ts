export type BlogDbType = {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt?: string;
  isMembership?: boolean;
};

export type GetBlogsQuery = {
  /**
   * Search term for blog Name: Name should contain this term in any position
   */
  searchNameTerm?: string;
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
