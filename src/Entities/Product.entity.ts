import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category.entity';
import { Manufacture } from './Manufacture.entity';

import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-type-json';

@Entity('product')
@ObjectType()
export class Product extends BaseEntity {
  @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { unique: true, default: '', name: 'code' })
  code: string;

  @Field()
  @Column('text', { nullable: false, name: 'title' })
  title: string;

  @Field()
  @Column('int', { name: 'description' })
  price: number;

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
