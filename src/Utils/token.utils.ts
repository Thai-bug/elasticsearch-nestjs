import { User } from '@Entities/User.entity';
import * as jwt from 'jsonwebtoken';

export const generateAToken = (user: User, type: string) => {
  switch (type) {
    case 'refresh':
      return jwt.sign({ id: user.id }, process.env.REFRESH_KEY);

    default:
      return jwt.sign({ id: user.id }, process.env.ACCESS_KEY, {
        expiresIn: '31d',
      });
  }
};

export const verifyAToken = (token: string, type: string) => {
  try {
    return jwt.verify(
      token,
      type === 'access' ? process.env.ACCESS_KEY : process.env.REFRESH_KEY,
    );
  } catch (error) {
    return error;
  }
};
