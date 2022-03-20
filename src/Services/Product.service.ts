import { Product } from '@Entities/Product.entity';
import { Injectable } from '@nestjs/common';
import { ProductRepository } from '@Repositories/Product.repository';
import { BaseService } from './BaseService';
import { MyLogger } from './LoggerService';

@Injectable()
export class ProductService extends BaseService<Product, ProductRepository> {
  private readonly logger = new MyLogger(ProductService.name);
  constructor(repository: ProductRepository) {
    super(repository);
  }

  async getProducts(options: any): Promise<[Product[], number]> {
    return this.repository.findAndCount({...options});
  }

  async getProduct(options: any): Promise<Product> {
    return this.repository.findOne(options);
  }
}
