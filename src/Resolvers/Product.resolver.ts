import { Product } from '@Entities/Product.entity';
import { Inject } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProductService } from '@Services/Product.service';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(@Inject(ProductService) private productService: ProductService) {}

  @Query((returns) => Product)
  async products(@Args('id') id: number): Promise<[Product[], number]> {
    return await this.productService.getProducts({
      id: id,
    });
  }
}
