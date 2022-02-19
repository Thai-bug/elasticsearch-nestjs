import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { UserController } from '@Controllers/UserController';
import { UserService } from '@Services/UserService';
import { User } from '@Entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UsersModule {}
