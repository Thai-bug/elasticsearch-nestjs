import { Merchant } from '@Entities/Merchant.entity';
import { Order } from '@Entities/Order.entity';
import { Injectable } from '@nestjs/common';
import { MerchantRepository } from '@Repositories/Merchant.repository';
import { OrderRepository } from '@Repositories/Order.repository';
import { BaseService } from './BaseService';
import { MyLogger } from './LoggerService';

interface IFindOrder{
  userId?: number;
  merchantId?: number;
  status?: string;
  skip?: number;
  take?: number;
  fromDate?: Date;
  toDate?: Date;
  manufactureId?: number;
  merchantCode?: string;
}

@Injectable()
export class OrderService extends BaseService<Order, OrderRepository> {
  private readonly logger = new MyLogger(OrderService.name);
  constructor(repository: OrderRepository) {
    super(repository);
  }

  async getOrders(params: IFindOrder) {
    let [skip, take] = [params.skip || 0, params.take || 0];
    console.log(take);
    const builder = this.repository.createQueryBuilder('order')
    .innerJoinAndSelect('order.user', 'user')
    .innerJoinAndSelect('user.merchant', 'merchant');

    if (params.userId) {
      builder.andWhere('order.user_id = :userId', { userId: params.userId });
    }

    if (params.merchantId) {
      builder.andWhere('merchant.id = :merchantId', { merchantId: params.merchantId });
    }

    if(params.merchantCode){
      builder.andWhere('merchant.code = :merchantCode', { merchantCode: params.merchantCode });
    }

    if (params.status) {
      builder.andWhere('order.status = :status', { status: params.status });
    }

    if (params.fromDate) {
      builder.andWhere('order.created_at >= :fromDate', { fromDate: params.fromDate });
    }
    

    if (params.toDate) {
      builder.andWhere('order.created_at <= :toDate', { toDate: params.toDate });
    }

    return await builder
      .orderBy('order.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .getMany()
      .catch(e => e);
  }

  // async getMerchants(options: any): Promise<[Merchant[], number]> {
  //   return this.repository.findAndCount({...options});
  // }

  // async getMerchant(options: any): Promise<Merchant> {
  //   return this.repository.findOne(options);
  // }
}
