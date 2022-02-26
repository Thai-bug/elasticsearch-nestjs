import { Category } from '@Entities/Category.entity';
import {
  EntityRepository,

  FindOneOptions,
  Repository,
} from 'typeorm';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
}
