import { Product } from '@Entities/Product.entity';
import { Inject } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProductService } from '@Services/Product.service';

@Resolver((of) => Product)
export class ProductResolver{
  constructor(@Inject(ProductService) private productService: ProductService) {}

  @Query((returns) => Product)
  async customer(@Args('id') id: string): Promise<Product> {
    return await this.productService.findById(id);
  }
}
