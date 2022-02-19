import { User } from '@Entities/User.entity';
import { UsersModule } from '@Modules/User.module';
import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
  CacheModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '@Middlewares/LoggerMiddleware';
import { Role } from '@Entities/Role.entity';

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
        User,
        Role
      ],
      // synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    ConfigModule.forRoot(),
    CacheModule.register(),
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
