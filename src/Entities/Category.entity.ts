import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './Product.entity';

@Entity('category')
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true, default: '', name: 'code' })
  code: string;

  @Column('text', { nullable: false, name: 'title' })
  title: string;

  @OneToMany((type) => Product, (product) => product.category)
  products: Product[];

  @Column('boolean', { name: 'status', default: true })
  status: boolean;

  @Column('jsonb', { name: 'extra_info', default: {} })
  extraInfo: object;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
