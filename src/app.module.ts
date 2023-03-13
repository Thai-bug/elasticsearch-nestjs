import { Module } from '@nestjs/common';
import { ElasticModule } from './elastic/elastic.module';
import { PostModule } from './post/post.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post/post.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'MAIN_DATABASE',
      type: 'postgres',
      host: 'localhost',
      port: 9013,
      username: 'thai-bug',
      password: '12022021',
      database: 'dev',
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
