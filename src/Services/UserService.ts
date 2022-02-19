import { IUserService } from '@Interfaces/Services/IUser.service';
import { Injectable, Logger } from '@nestjs/common';

import { User } from '@Entities/User.entity';
import { BaseService } from './BaseService';
import { UserRepository } from '@Repositories/User.repository';
import { MyLogger } from './LoggerService';
import { compare } from '@Utils/bcrypt';

@Injectable()
export class UserService extends BaseService<User, UserRepository> implements IUserService {
  private readonly logger = new MyLogger(UserService.name);
  constructor(repository: UserRepository) {
    super(repository)
  }

  async getUser(options): Promise<User> {
    this.logger.log('Do something...', '123');
    return this.repository.findOne(options);
  }

  async login(options): Promise<User | null> {
    const user = await this.getUser({email: options.email, status: true});
    if(!user || !(await UserService.comparePassword(options.password, user.password))) {
      return null;
    }

    return user;
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return await compare(password, hash);
  }
}
