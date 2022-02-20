import { User } from '@Entities/User.entity';

export interface IUserRepository {
  index(): Promise<User[]>;
}
