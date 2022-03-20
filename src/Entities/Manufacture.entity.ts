import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from '@Entities/Product.entity';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@Entity('manufacture')
@ObjectType()
export class Manufacture extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { unique: true, default: '', name: 'code' })
  code: string;

  @Field()
  @Column('text', { nullable: false, name: 'title' })
  title: string;

  @Field((type) => [Product])
  @OneToMany((type) => Product, (product: Product) => product.manufacture)
  products: Product[];

  @Field()
  @Column('boolean', { name: 'status', default: true })
  status: boolean;

  @Field(() => GraphQLJSONObject)
  @Column('jsonb', { name: 'extra_info', default: {} })
  extraInfo: object;

  @Field()
  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
