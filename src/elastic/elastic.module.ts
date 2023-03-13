import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticController } from './elastic.controller';
import { ElasticService } from './elastic.service';

@Module({
  controllers: [ElasticController],
  providers: [ElasticService],
  imports: [
    ConfigModule,
    ElasticsearchModule.register({
      node: 'http://localhost:9200',
      auth:{
        username: 'elastic',
        password: 'changeme'
      }
    }),

    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: 'http://localhost:9200',
        auth: {
          username: 'elastic',
          password: ''
        }
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ElasticService]
})
export class ElasticModule {}
