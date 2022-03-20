import { v4 } from 'uuid';

export const genRandomUUId = (): string => {
  return v4();
};
