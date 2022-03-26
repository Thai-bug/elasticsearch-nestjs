import { IKeyAble } from '@Interfaces/Meta/Base.meta';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { GraphQLJSONObject } from 'graphql-type-json';
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MerchantUser } from './MerchantUser.entity';
import { User } from './User.entity';

@ObjectType()
@Entity('merchant')
export class Merchant extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { name: 'code', unique: true })
  code: string;

  @Field()
  @Column('text', { name: 'title' })
  title: string;

  @Field()
  @Column('bool', { name: 'status', default: true })
  status: true;

  @Field(()=>GraphQLJSONObject)
  @Column('json', { name: 'extra_info', default: {} })
  extraInfo: IKeyAble;

  @Field(()=>GraphQLJSONObject)
  @Column('json', { name: 'meta_info', default: {} })
  @Exclude()
  metaInfo: IKeyAble;

  @Field((type) => [MerchantUser])
  @OneToMany(() => MerchantUser, (user) => user.merchant)
  merchantUsers: MerchantUser[];

  @Field()
  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
