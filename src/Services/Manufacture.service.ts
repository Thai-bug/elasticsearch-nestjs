import { Manufacture } from '@Entities/Manufacture.entity';
import { Injectable } from '@nestjs/common';
import { ManufactureRepository } from '@Repositories/Manufacture.repository';
import { BaseService } from './BaseService';
import { MyLogger } from './LoggerService';

@Injectable()
export class ManufactureService extends BaseService<
  Manufacture,
  ManufactureRepository
> {
  private readonly logger = new MyLogger(ManufactureService.name);
  constructor(repository: ManufactureRepository) {
    super(repository);
  }

  async getManufactures(options: any): Promise<[Manufacture[], number]> {
    return this.repository.findAndCount(options);
  }

  async getManufacture(options: any): Promise<Manufacture> {
    return this.repository.findOne(options);
  }
}
