import { Exclude, Expose } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { Role } from './Role.entity';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Merchant } from './Merchant.entity';
import { Order } from './Order.entity';

@ObjectType()
@Entity('user')
@Tree('closure-table', {
  ancestorColumnName: (column) => `${column.propertyName}_parent`,
  descendantColumnName: (column) => `${column.propertyName}_child`,
})
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { name: 'code', unique: true, default: '' })
  code: string;

  @Field()
  @Column('text', { name: 'first_name' })
  firstName: string;

  @Field()
  @Column('text', { name: 'last_name' })
  lastName: string;

  @Field()
  @Column('text', { name: 'email', unique: true })
  email: string;

  @Field()
  @Column('text', { name: 'password' })
  @Exclude()
  password: string;

  @Field()
  @Column('boolean', { name: 'status', default: true })
  status: boolean;

  @Field()
  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Field((type) => Role)
  @ManyToOne((type) => Role, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToMany((type) => Order, (order: Order) => order.user)
  orders: Order[];

  @ManyToOne((type) => Merchant, { eager: true })
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @TreeChildren()
  children: User[];

  @TreeParent({
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: User;
}
