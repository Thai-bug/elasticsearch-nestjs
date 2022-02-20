import { Category } from '@Entities/Category.entity';
import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '@Repositories/Category.repository';
import { FindConditions, FindOneOptions } from 'typeorm';
import { BaseService } from './BaseService';
import { MyLogger } from './LoggerService';

@Injectable()
export class CategoryService extends BaseService<Category, CategoryRepository> {
  private readonly logger = new MyLogger(CategoryService.name);
  constructor(repository: CategoryRepository) {
    super(repository);
  }

  async getCategories(options: any): Promise<[Category[], number]> {
    return this.repository.findAndCount(options);
  }
}
