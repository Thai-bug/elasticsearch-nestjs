import { User } from '@Entities/User.entity';
import { UsersModule } from '@Modules/User.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './Controllers/UserController';
import { UserService } from './Services/UserService';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 9013,
      username: 'thai-bug',
      password: '12022021',
      database: 'fake-store',
      entities: [
        User
      ],
      synchronize: true,
      autoLoadEntities: true
    }),
    UsersModule
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
