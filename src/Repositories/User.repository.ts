import { User } from '@Entities/User.entity';
import { IUserRepository } from '@Interfaces/Repositories/IUser.repository';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository
  extends Repository<User>
  implements IUserRepository
{
  index(): Promise<User[]> {
    return this.find();
  }
}
