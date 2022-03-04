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
import { CategoryModule } from '@Modules/Category.module';
import { Category } from '@Entities/Category.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_SERVER,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Role, Category],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    CategoryModule,
    
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
