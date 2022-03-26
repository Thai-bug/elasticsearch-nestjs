import { MerchantUser } from '@Entities/MerchantUser.entity'; 
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(MerchantUser)
export class MerchantUserRepository extends Repository<MerchantUser> {}
