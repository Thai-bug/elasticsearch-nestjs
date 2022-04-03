import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './Order.entity';

@Entity('order_status')
export class OrderStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'code', unique: true, default: '' })
  code: string;

  @Column('text', { name: 'title' })
  title: string;

  @Column('boolean', { name: 'status', default: true })
  status: boolean;

  @OneToMany((type) => Order, (order: Order) => order.status)
  orders: Order[];

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
