import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './Role.entity';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Merchant } from './Merchant.entity';

@ObjectType()
@Entity('user')
export class User extends BaseEntity {
  @Field(()=>ID)
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
  @Column('text', { name: 'email' })
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

  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.children)
  @JoinColumn({ name: 'parent' })
  parent: User;

  @Field(() => [User])
  @OneToMany((type) => User, (user) => user.parent)
  children: User[];

  @Field(() => Merchant)
  @ManyToOne((type) => Merchant, (merchant) => merchant.merchantUsers)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;
}
