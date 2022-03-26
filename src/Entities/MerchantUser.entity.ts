import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Merchant } from './Merchant.entity';

@ObjectType()
@Entity('merchant_user')
export class MerchantUser extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { name: 'code', unique: true, default: '' })
  code: string;

  @Column('text', { name: 'first_name' })
  firstName: string;

  @Column('text', { name: 'last_name' })
  lastName: string;

  @Column('text', { name: 'username' })
  username: string;

  @Column('text', { name: 'email' })
  email: string;

  @Column('text', { name: 'password' })
  @Exclude()
  password: string;

  @Column('boolean', { name: 'status', default: true })
  status: boolean;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne((type) => Merchant, (merchant) => merchant.merchantUsers)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}
