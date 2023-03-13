import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';

// import { ElasticController } from './elastic.controller';
import { PostElasticService } from './post-elastic.service';

@Module({
  // controllers: [ElasticController],
  providers: [PostElasticService],
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_HOST'),
        auth: {
          apiKey: configService.get('ELASTICSEARCH_API_KEY')
        }
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [PostElasticService]
})
export class ElasticModule {
  constructor(){
    console.log(process.env.ELASTICSEARCH_HOST)
  }
}

