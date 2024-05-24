import { GetUserSchema } from '../../models';

declare global {
  namespace Express {
    interface Locals {
      user?: GetUserSchema;
    }
  }
}
