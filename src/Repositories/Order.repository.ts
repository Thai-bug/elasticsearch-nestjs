
import { Order } from '@Entities/Order.entity';
import {
  EntityRepository,
  FindOneOptions,
  Repository
} from 'typeorm';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> { }
