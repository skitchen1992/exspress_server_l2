import { checkSchema } from 'express-validator';

export const validatePostSchema = () => {
  return checkSchema({
    name: {
      exists: {
        bail: true,
        errorMessage: {
          massage: 'Is required',
          field: 'name',
        },
      },
      isString: {
        bail: true,
        errorMessage: {
          massage: 'Not a string',
          field: 'name',
        },
      },
      trim: {},
      isLength: {
        options: { min: 1, max: 15 },
        errorMessage: {
          massage: 'Cannot be more than 15',
          field: 'name',
        },
      },
    },
    description: {
      exists: {
        bail: true,
        errorMessage: {
          massage: 'Is required',
          field: 'description',
        },
      },
      isString: {
        bail: true,
        errorMessage: {
          massage: 'Not a string',
          field: 'description',
        },
      },
      trim: {},
      isLength: {
        options: { min: 1, max: 500 },
        errorMessage: {
          massage: 'Cannot be more than 500',
          field: 'description',
        },
      },
    },
    websiteUrl: {
      exists: {
        bail: true,
        errorMessage: {
          massage: 'Is required',
          field: 'websiteUrl',
        },
      },
      isString: {
        bail: true,
        errorMessage: {
          massage: 'Not a string',
          field: 'websiteUrl',
        },
      },
      trim: {},
      isLength: {
        bail: true,
        options: { min: 1, max: 100 },
        errorMessage: {
          massage: 'Cannot be more than 100',
          field: 'websiteUrl',
        },
      },
      isURL: {
        errorMessage: {
          massage: 'URL is not correct',
          field: 'websiteUrl',
        },
      },
    },
  });
};
