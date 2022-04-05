import { MerchantProduct } from '@Entities/MerchantProduct.entity';
import { EntityRepository, FindOneOptions, Repository } from 'typeorm';

@EntityRepository(MerchantProduct)
export class MerchantProductRepository extends Repository<MerchantProduct> {}
