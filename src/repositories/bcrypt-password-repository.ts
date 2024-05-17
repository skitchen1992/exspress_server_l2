import { compare, genSalt, hash } from 'bcryptjs';
export const passwordRepository = {
  hashPassword: async (password: string, saltRounds = 10) => {
    const salt = await genSalt(saltRounds);
    return await hash(password, salt);
  },
  comparePasswords: async (password: string, hashedPassword: string) => {
    return await compare(password, hashedPassword);
  },
};
