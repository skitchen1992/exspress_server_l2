import { ValidationChain, checkExact } from 'express-validator';
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema';

export const checkExactMiddleware = (validateSchema: {
  (): RunnableValidationChains<ValidationChain>;
  (): ValidationChain | ValidationChain[];
}) => {
  return checkExact([validateSchema()], {
    locations: ['body'],
    message: {
      massage: 'Too many fields specified',
      field: 'body',
    },
  });
};
