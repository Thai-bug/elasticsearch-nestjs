import * as bcrypt from 'bcryptjs';

export const hash = async (password: string): Promise<string> =>
  await bcrypt.hash(password, 10);

export const compare = async (
  password: string,
  hash: string,
): Promise<boolean> => await bcrypt.compare(password, hash);
