import { Body, Get } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { Controller, Post } from '@nestjs/common';
import { Post as PostEntity } from './post.entity';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService
  ) {}

  @Post('/create')
  async createPost(@Body() post: any) {
    return this.postService.createPost(post);
  }

  @Get()
  async getPosts(@Query('search') search: string) {
    if (!search) {
      search = ''
    }
    // return this.postService.getAllPosts();

    return this.postService.searchForPosts(search);
  }

}
