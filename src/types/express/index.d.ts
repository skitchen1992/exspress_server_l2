declare global {
  namespace Express {
    interface Locals {
      user?: { userId: string | null; userLogin: string | null };
    }
  }
}
