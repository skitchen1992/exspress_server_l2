export const dataSetNewBlog = {
  name: 'Test',
  description: 'Test description',
  websiteUrl: 'https://string.com',
};

export const dataSetNewBlog1 = {
  name: 'Test very long string in the world',
  description: 'Test description',
  websiteUrl: 'https://string.com',
};

export const errorDataSet1 = {
  errorsMessages: [
    {
      message: 'Cannot be more than 15',
      field: 'name',
    },
  ],
};

export const dataSetNewBlog2 = {
  name: null,
  description: 'Test description',
  websiteUrl: 'https://string.com',
};


export const errorDataSet2 = {
  errorsMessages: [
    {
      message: 'Not a string',
      field: 'name',
    },
  ],
};

export const dataSetNewBlog3 = {
  description: 'Test description',
  websiteUrl: 'https://string.com',
};


export const errorDataSet3 = {
  errorsMessages: [
    {
      message: 'Is required',
      field: 'name',
    },
  ],
};

export const dataSetNewBlog4 = {
  name: 'Test name',
  description: 'Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world Test very long string in the world',
  websiteUrl: 'https://string.com',
};

export const errorDataSet4 = {
  errorsMessages: [
    {
      message: 'Cannot be more than 500',
      field: 'description',
    },
  ],
};

export const dataSetNewBlog5 = {
  name: 'Test name',
  description: {},
  websiteUrl: 'https://string.com',
};

export const errorDataSet5 = {
  errorsMessages: [
    {
      message: 'Not a string',
      field: 'description',
    },
  ],
};

export const dataSetNewBlog6 = {
  name: 'Test name',
  websiteUrl: 'https://string.com',
};

export const errorDataSet6 = {
  errorsMessages: [
    {
      message: 'Is required',
      field: 'description',
    },
  ],
};

export const dataSetNewBlog7 = {
  name: 'Test name',
  description: "Test description",
  websiteUrl: 'https://string',
};

export const errorDataSet7 = {
  errorsMessages: [
    {
      message: 'URL is not correct',
      field: 'websiteUrl',
    },
  ],
};
