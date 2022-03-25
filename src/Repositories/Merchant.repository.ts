import { Merchant } from '@Entities/Merchant.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Merchant)
export class MerchantRepository extends Repository<Merchant> {}
