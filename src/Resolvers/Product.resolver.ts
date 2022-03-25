import { Product } from '@Entities/Product.entity';
import { ProductResponse } from '@Interfaces/Meta/Product.meta';
import { Inject } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { ProductService } from '@Services/Product.service';
import { serialize } from 'class-transformer';

@Resolver((of) => Product)
export class ProductResolver {
  constructor(@Inject(ProductService) private productService: ProductService) {}

  @Query((returns) => ProductResponse)
  async products(
    @Args('id', {nullable: true}) id: number,
    @Args('page', { defaultValue: 1 }) page: number,
    @Args('limit', { defaultValue: 10 }) limit: number,
  ): Promise<ProductResponse> {
    const [result, total] = await this.productService.getProducts({
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: JSON.parse(serialize(result)),
      total: total,
    };
  }
}
