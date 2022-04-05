import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatus } from './OrderStatus.entity';
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
}
