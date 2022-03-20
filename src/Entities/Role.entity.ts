import { Exclude } from 'class-transformer';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './User.entity';

import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('role')
export class Role extends BaseEntity {
  @Field(()=>ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text', { name: 'title' })
  title: string;

  @Field()
  @Column('text', { name: 'code', unique: true })
  @Exclude()
  code: string;

  @Field()
  @Column('boolean', { name: 'status', default: true })
  status: boolean;

  @Field()
  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Field((type) => [User])
  @OneToMany((type) => User, (user) => user.role)
  users: User[];
}
