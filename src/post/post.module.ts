import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ElasticModule } from 'src/elastic/elastic.module';
import { PostController } from './post.controller';
import { Post } from './post.entity';
import { PostService } from './post.service';

@Module({
  controllers: [PostController],
  providers: [PostService],
  imports:[
    TypeOrmModule.forFeature([
      Post
    ], 'MAIN_DATABASE'),
    ElasticModule
  ]
})
export class PostModule {}
