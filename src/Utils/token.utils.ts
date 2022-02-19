import { User } from '@Entities/User.entity';
import * as jwt from 'jsonwebtoken';

export const generateAToken = (user: User, type: string) => {
  switch (type) {
    case 'refresh':
      return jwt.sign({id: user.id}, process.env.REFRESH_KEY);
  
    default:
      return jwt.sign({id: user.id} , process.env.ACCESS_KEY, {expiresIn: '3h'});
  }
}

export const verifyAToken = (token: string, type: string) => {
  switch (type) {
    case 'refresh':
      return jwt.verify(token, process.env.REFRESH_KEY);
  
    default:
      return jwt.verify(token, process.env.ACCESS_KEY);
  }
}