import { User } from '@Entities/User.entity';
import { UsersModule } from '@Modules/User.module';
import {
  Module,
  MiddlewareConsumer,
  RequestMethod,
  NestModule,
  CacheModule,
} from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '@Middlewares/LoggerMiddleware';
import * as path from 'path';

import { Role } from '@Entities/Role.entity';
import { CategoryModule } from '@Modules/Category.module';
import { Category } from '@Entities/Category.entity';
import { PrivateModule } from '@Modules/Private.module';
import { Manufacture } from '@Entities/Manufacture.entity';
import { ManufactureModule } from '@Modules/Manufacture.module';
import { Product } from '@Entities/Product.entity';
import { ProductModule } from '@Modules/Product.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'src/schema.graphql',
      debug: false,
      playground: true,
    }),

    CacheModule.register(),

    ServeStaticModule.forRoot({
      serveRoot: '/cdn/public',
      rootPath: path.join(__dirname, '..', 'public/static-files'),
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_SERVER,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Role, Category, Manufacture, Product],
      synchronize: true,
      autoLoadEntities: true,
    }),
    UsersModule,
    CategoryModule,
    PrivateModule,
    ManufactureModule,
    ProductModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
