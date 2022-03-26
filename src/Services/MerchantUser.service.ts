import { MerchantUser } from "@Entities/MerchantUser.entity";
import { Injectable } from "@nestjs/common";
import { MerchantUserRepository } from "@Repositories/MerchantUser.repository";
import { BaseService } from "./BaseService";
import { MyLogger } from './LoggerService';

@Injectable()
export class MerchantUserService extends BaseService<MerchantUser, MerchantUserRepository> {
  private readonly logger = new MyLogger(MerchantUserService.name);
  constructor(repository: MerchantUserRepository) {
    super(repository);
  }

  async login(options: any): Promise<MerchantUser> {
    return this.repository.findOne(options);
  }
}