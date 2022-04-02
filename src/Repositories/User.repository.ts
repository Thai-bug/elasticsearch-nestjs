import { User } from '@Entities/User.entity';
import { IUserRepository } from '@Interfaces/Repositories/IUser.repository';
import { EntityRepository, Repository, TreeRepository } from 'typeorm';

@EntityRepository(User)
export class UserRepository
  extends TreeRepository<User>
  implements IUserRepository
{
  index(): Promise<User[]> {
    return this.find();
  }
}
