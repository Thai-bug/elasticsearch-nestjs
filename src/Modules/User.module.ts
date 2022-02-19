import {
  CacheModule,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from '@Controllers/UserController';
import { UserService } from '@Services/UserService';
import { UserRepository } from '@Repositories/User.repository';
import { UserMiddleware } from '@Middlewares/UserMiddleware';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository]), CacheModule.register()],
  exports: [TypeOrmModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserMiddleware)
      .exclude({ path: 'api/v1/users/login', method: RequestMethod.POST })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
