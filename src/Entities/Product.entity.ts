import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category.entity';
import { Manufacture } from './Manufacture.entity';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';
import { Exclude } from 'class-transformer';
import { IKeyAble } from '@Interfaces/Meta/Base.meta';
import { MerchantProduct } from './MerchantProduct.entity';
import { Order } from './Order.entity';
import { OrderDetail } from './OrderDetail.entity';

@Entity('product')
@ObjectType()
export class Product extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field({ nullable: true })
  @Column('text', { unique: true, default: '', name: 'code' })
  code: string;

  @Field({ nullable: true })
  @Column('text', { nullable: false, name: 'title' })
  title: string;

  @Field({ nullable: true })
  @Column('bigint', { name: 'price', nullable: true })
  price: number;

  @Field({ nullable: true })
  @Column('int', { name: 'vat' })
  vat: number;

  @Field({ nullable: true })
  @Column('bigint', { name: 'net', nullable: true })
  net: number;

  @Field((type) => Category)
  @ManyToOne((type) => Category, (category) => category.products, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Field((type) => Manufacture)
  @ManyToOne((type) => Manufacture, (manufacture) => manufacture.products, {
    eager: true,
  })
  @JoinColumn({ name: 'manufacture_id' })
  manufacture: Manufacture;

  @Field({ nullable: true })
  @Column('boolean', { name: 'status', default: true })
  status: boolean;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column('jsonb', { name: 'extra_info', default: {} })
  extraInfo: IKeyAble;

  @Field(() => GraphQLJSONObject, { nullable: true })
  @Column('jsonb', { name: 'meta_info', default: {} })
  @Exclude()
  metaInfo: IKeyAble;

  @Field({ nullable: true })
  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @OneToMany((type) => MerchantProduct, (merchant) => merchant.merchant)
  merchants: MerchantProduct[];

  @OneToMany((type) => OrderDetail, (orderDetail) => orderDetail.product)
  orderDetails: OrderDetail[];

  @BeforeInsert()
  async beforeInsert() {
    this.net = +(+this.price.toFixed(0) * (1 + +this.vat / 100)).toFixed(0);
  }
}
