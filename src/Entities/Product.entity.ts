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

@Entity('product')
export class Product extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { unique: true, default: '', name: 'code' })
  code: string;

  @Column('text', { nullable: false, name: 'title' })
  title: string;

  @Column('int', { name: 'description' })
  price: number;

  @ManyToOne((type) => Category, (category) => category.products, {
    eager: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne((type) => Manufacture, (manufacture) => manufacture.products, {
    eager: true,
  })
  @JoinColumn({ name: 'manufacture_id' })
  manufacture: Manufacture;

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
