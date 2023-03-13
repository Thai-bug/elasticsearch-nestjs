import { Module } from '@nestjs/common';
import { ElasticModule } from './elastic/elastic.module';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/post.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      name: process.env.MAIN_DB_NAME,
      type: 'postgres',
      host: process.env.MAIN_DB_HOST,
      port: +process.env.MAIN_DB_PORT,
      username: process.env.MAIN_DB_USERNAME,
      password: process.env.MAIN_DB_PASSWORD,
      database: process.env.MAIN_DB,
      entities: [
        Post
      ],
      synchronize: true,
    }),
    ElasticModule, 
    PostModule
  ],
})
export class AppModule {}
