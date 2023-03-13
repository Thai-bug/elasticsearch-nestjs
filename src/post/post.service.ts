import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostElasticService } from 'src/elastic/post-elastic.service';
import { Repository, In } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post, 'MAIN_DATABASE') private readonly postRepository: Repository<Post>,
    private readonly postElasticService: PostElasticService
  ) { }

  async createPost(post: Post) {
    await this.postRepository.save(post);
    await this.postElasticService.indexPost(post)
    return post
  }

  async searchForPosts(text: string) {
    const results = await this.postElasticService.search(text);
    await this.postElasticService.remove()
    const ids = results.map(result => result.id);
    if (!ids.length) {
      return [];
    }
    return this.postRepository
      .find({
        where: { id: In(ids) }
      });
  }
}
