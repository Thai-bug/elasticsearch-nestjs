import { IUserService } from '@Interfaces/Services/IUser.service';
import { Injectable } from '@nestjs/common';
import {
  Not
} from 'typeorm'

import { User } from '@Entities/User.entity';
import { BaseService } from './BaseService';
import { UserRepository } from '@Repositories/User.repository';
import { MyLogger } from './LoggerService';
import { compare } from '@Utils/bcrypt';


@Injectable()
export class UserService
  extends BaseService<User, UserRepository>
  implements IUserService
{
  private readonly logger = new MyLogger(UserService.name);
  constructor(repository: UserRepository) {
    super(repository);
  }

  async getUser(options): Promise<User> {
    this.logger.log('Do something...', '123');
    return this.repository.findOne(options);
  }

  async login(options): Promise<User | null> {
    const user = await this.getUser({ email: options.email, status: true });
    if (
      !user ||
      !(await UserService.comparePassword(options.password, user.password))
    ) {
      return null;
    }

    return user;
  }

  async list(option: any, offset: number, limit: number): Promise<[User[], number]> {
    return this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.children', 'children')
      .leftJoinAndSelect('user.parent', 'parent')
      .where('user.email like :email', { email: `%${option.search}%` })
      .orWhere('user.firstName like :firstName', { firstName: `%${option.search}%` })
      .orWhere('user.lastName like :lastName', { lastName: `%${option.search}%` })
      .andWhere({role: { id: Not(1) } })
      .take(limit)
      .skip(offset)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.getUser({ email: email });
    return user;
  }

  async updateProfile(info: any): Promise<boolean> {
    return true;
  }

  static async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await compare(password, hash);
  }
}
