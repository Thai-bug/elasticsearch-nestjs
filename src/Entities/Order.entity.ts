import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderDetail } from './OrderDetail.entity';
import { OrderStatus } from './OrderStatus.entity';
import { Product } from './Product.entity';
import { User } from './User.entity';

@Entity('order')
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'code', unique: true, default: '' })
  code: string;

  @ManyToOne((type) => OrderStatus, (orderStatus) => orderStatus.orders, {
    eager: true,
  })
  @JoinColumn({ name: 'status_id' })
  status: OrderStatus;

  @ManyToOne((type) => User, (user: User) => user.orders)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany((type) => OrderDetail, (orderDetail: OrderDetail) => orderDetail.order)
  orderDetails: OrderDetail[];

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column('timestamp', {
    name: 'paid_date',
    nullable: true
  })
  paidDate: Date;
}
