import * as crypto from 'crypto';

export const randomString = (size: number = 10): string =>
  crypto.randomBytes(size).toString('hex');
