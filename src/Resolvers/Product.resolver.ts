import { Product } from '@Entities/Product.entity';
import { ProductResponse } from '@Interfaces/Meta/Product.meta';
import { Inject, UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { ProductService } from '@Services/Product.service';
import { serialize } from 'class-transformer';
import { hasRoles } from 'src/Auth/Decorators/Role.decorators';
import { GqlAuthGuard } from 'src/Auth/Guards/GraphJwtGuard.guard';
import { GraphRolesGuard } from 'src/Auth/Guards/GraphRole.guard';
import { RolesGuard } from 'src/Auth/Guards/Role.guard';

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

  @Query((returns) => ProductResponse)
  @hasRoles('PRODUCT_MANAGER')
  @UseGuards(GqlAuthGuard, GraphRolesGuard)
  async productsAdmin(
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
