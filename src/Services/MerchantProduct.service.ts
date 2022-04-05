import { Merchant } from '@Entities/Merchant.entity';
import { MerchantProduct } from '@Entities/MerchantProduct.entity';
import { Product } from '@Entities/Product.entity';
import { Injectable } from '@nestjs/common';
import { MerchantRepository } from '@Repositories/Merchant.repository';
import { MerchantProductRepository } from '@Repositories/MerchantProduct.repository';
import { Brackets } from 'typeorm';
import { BaseService } from './BaseService';
import { MyLogger } from './LoggerService';

@Injectable()
export class MerchantProductService extends BaseService<
  MerchantProduct,
  MerchantProductRepository
> {
  private readonly logger = new MyLogger(MerchantProductService.name);
  constructor(repository: MerchantProductRepository) {
    super(repository);
  }

  async cancelActive(
    merchant: Merchant,
    product: Product,
    fromDate: Date,
    toDate?: Date,
  ): Promise<void> {
    this.repository
      .createQueryBuilder('product_merchant')
      .where(
        new Brackets(qb=>{
          qb.where('fromDate <= :fromDate', { fromDate })
          .andWhere('toDate >= :fromDate', { fromDate })
        })
      )

      // .where('product.id = :id', { id: product.id })
      // .andWhere('merchant.id = :id', { id: merchant.id })
      // .andWhere(
      //   new Brackets((qb) => {
      //     qb.where('fromDate <= :fromDate', {
      //       fromDate,
      //     });
      //     qb.andWhere('toDate >= :fromDate', {
      //       fromDate,
      //     });
      //   }),
      // )
      .update()
      .set({ status: false })
      .execute();
  }
}
