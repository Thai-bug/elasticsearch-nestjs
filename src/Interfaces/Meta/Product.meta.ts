import { Product } from '@Entities/Product.entity';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProductResponse {
  @Field((type) => [Product])
  data: Product[];

  @Field((type) => Int)
  total: number;
}

export type InputFilter = {
  search: String;

  condition(filter: string, skip: number, take: number): [Product];
};
