import * as crypto from 'crypto';

export const randomString = (size = 10): string =>
  crypto.randomBytes(size).toString('hex');
