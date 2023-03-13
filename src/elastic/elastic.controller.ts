import { Controller, Get } from '@nestjs/common';
import { ElasticService } from './elastic.service';

@Controller('elastic')
export class ElasticController {
  constructor(
    // @Inject(ElasticService) private readonly elasticService: ElasticService
    private readonly elasticService: ElasticService
  ) {

  }
}
