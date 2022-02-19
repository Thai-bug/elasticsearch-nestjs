import { IUserService } from '@Interfaces/Services/IUserService';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@Entities/User.entity';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUser(id: number): Promise<any> {
    return {
      id: id,
      name: 'John Doe',
      email: '',
    };
  }
}
