import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Post } from 'src/post/post.entity';


interface PostSearchBody {
  id: number,
  title: string,
  content: string,
  authorId: number
}

interface PostSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: PostSearchBody;
    }>;
  };
}

@Injectable()
export class ElasticService {
  index = 'posts'
  constructor(
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  async indexPost(post: Post) {
    return this.elasticsearchService.index({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
      }
    })
  }

  async search(text: string) {
    const { body } = await this.elasticsearchService.search<PostSearchResult>({
      index: this.index,
      body: {
        query: {
          multi_match: {
            query: text,
            fields: ['title', 'content']
          }
        }
      }
    })
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }

  async remove() {
    this.elasticsearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            title: 'Hello World',
          }
        }
      }
    })
  }
}
