import { Injectable } from '@nestjs/common';
import ElasticSearch from '@elastic/elasticsearch';

import { Post } from 'src/post/post.entity';
import { ElasticsearchModule, ElasticsearchService } from '@nestjs/elasticsearch';

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
export class PostElasticService {
  index = 'posts'
  constructor(
    private readonly elasticsearchService: ElasticsearchService
  ) {}

  async indexPost(post: Post) {
    return this.elasticsearchService.index ({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        content: post.content,
      }
    })
  }

  async search(text: string) {
    const result = await this.elasticsearchService.search<PostSearchBody>({
      index: this.index,
      from: 0,
      size: 10,
      query:{
        match: {
          title: text
        }
      }
    })

    return result.hits.hits.map((item) => item._source)
  }

  async remove() {
    // this.elasticsearchService.deleteByQuery({
    //   index: this.index,
    //   body: {
    //     query: {
    //       match: {
    //         title: 'Hello World',
    //       }
    //     }
    //   }
    // })
  }
}
