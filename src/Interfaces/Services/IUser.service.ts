import { User } from '@Entities/User.entity';

export interface IUserService {
  getUser(id: number): Promise<User>;

  login(options: any): Promise<User | null>;

  list(option: any, offset: number, limit: number): Promise<[User[], number]>;

  findByEmail(email: string): Promise<User>;
}
