import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { UserController } from '@Controllers/UserController';
import { UserService } from '@Services/UserService';
import { UserRepository } from '@Repositories/User.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
    ])
  ],
  exports: [TypeOrmModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
