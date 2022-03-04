import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@Controllers/User.controller';
import { UserService } from '@Services/UserService';
import { UserRepository } from '@Repositories/User.repository';
import { UserMiddleware } from '@Middlewares/UserMiddleware';
import { AuthModule } from './Auth.module';
import { CategoryService } from '@Services/CategoryService';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    CacheModule.register(),
    AuthModule,
  ],
  exports: [TypeOrmModule, UserService, AuthModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude({ path: 'api/v1/users/login', method: RequestMethod.POST })
      .forRoutes({ path: 'api/v1/users/detail', method: RequestMethod.ALL });
  }
}
