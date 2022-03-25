import { Merchant } from '@Entities/Merchant.entity';
import { Injectable } from '@nestjs/common';
import { MerchantRepository } from '@Repositories/Merchant.repository';
import { BaseService } from './BaseService';
import { MyLogger } from './LoggerService';

@Injectable()
export class MerchantService extends BaseService<Merchant, MerchantRepository> {
  private readonly logger = new MyLogger(MerchantService.name);
  constructor(repository: MerchantRepository) {
    super(repository);
  }

  async getMerchants(options: any): Promise<[Merchant[], number]> {
    return this.repository.findAndCount({...options});
  }

  async getMerchant(options: any): Promise<Merchant> {
    return this.repository.findOne(options);
  }
}
