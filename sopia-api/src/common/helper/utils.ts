import * as bcrypt from 'bcryptjs';

export const generateHashPassword = async (
  plainTextPassword: string,
): Promise<string> => {
  const salt = await bcrypt.genSalt(8);
  return bcrypt.hash(plainTextPassword, salt);
};
