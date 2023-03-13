import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ElasticService } from 'src/elastic/elastic.service';
import { Repository, In } from 'typeorm';
import { Post } from './post.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post, 'MAIN_DATABASE') private readonly postRepository: Repository<Post>,
    private readonly elasticService: ElasticService
  ) { }

  async createPost(post: Post) {
    await this.postRepository.save(post);
    console.log(await this.elasticService.indexPost(post));
    return post
  }

  async searchForPosts(text: string) {
    const results = await this.elasticService.search(text);
    // await this.elasticService.remove()
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
