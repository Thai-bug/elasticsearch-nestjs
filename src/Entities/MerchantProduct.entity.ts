import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Merchant } from './Merchant.entity';
import { Product } from './Product.entity';

@Entity('merchant_product')
export class MerchantProduct extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Merchant, (merchant) => merchant.products)
  @JoinColumn({ name: 'merchant_id' })
  merchant: Merchant;

  @ManyToOne((type) => Product, (product) => product.merchants)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('float', { name: 'commission', default: 0 })
  commission: number;

  @Column('boolean', { name: 'status', default: true })
  status: boolean;

  @Column('timestamp', { name: 'from_date' })
  fromDate: Date;

  @Column('timestamp', { name: 'to_date', nullable: true })
  toDate: Date;

  @Column('timestamp', {
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
