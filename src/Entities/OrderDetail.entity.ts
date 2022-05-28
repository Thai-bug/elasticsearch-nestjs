import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./Order.entity";
import { Product } from "./Product.entity";

@Entity('order_detail')
export class OrderDetail extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Order, (order) => order.orderDetails)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne((type) => Product, (product) => product.orderDetails)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column('int', { name: 'quantity', default: 1 })
  quantity: number;
}