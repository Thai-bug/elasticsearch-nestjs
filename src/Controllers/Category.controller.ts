import {
  CACHE_MANAGER,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CategoryService } from '@Services/CategoryService';
import { MyLogger } from '@Services/LoggerService';
import { response } from '@Utils/response.utils';
import { serialize } from 'class-transformer';
import { ILike } from 'typeorm';
import { hasRoles } from 'src/Auth/Decorators/Role.decorators';
import { JwtAuthGuard } from 'src/Auth/Guards/JwtGuard.guard';
import { RolesGuard } from 'src/Auth/Guards/Role.guard';

@Controller('/api/v1/categories')
export class CategoryController {
  private readonly logger = new MyLogger(CategoryController.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly categoryService: CategoryService,
  ) {}

  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCategories(@Request() request: Request) {
    const limit = +request['query']?.limit || 10;
    const offset = +request['query']?.offset || 0;
    const search = request['query']?.search || '';
    const [result, total] = await this.categoryService.getCategories({
      where: {
        status: true,
        title: ILike(`%${search}%`),
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: offset,
    });
    return response(200, 'successfully', {
      data: JSON.parse(serialize(result)),
      total: total,
    });
  }

  @Get('/demo')
  async get(){
    return 'hello'
  }

  @hasRoles('ADMIN', 'MANAGER', 'PRODUCT_MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/list')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCategoriesAdmin(@Request() request: Request) {
    const limit = +request['query']?.limit || 10;
    const offset = +request['query']?.offset || 0;
    const search = request['query']?.search;
    const [result, total] = await this.categoryService.getCategories({
      where: {
        title: ILike(`%${search.q}%`),
      },
      order: {
        createdAt: 'DESC',
      },
      take: limit,
      skip: offset,
    });
    return response(200, 'successfully', {
      data: JSON.parse(serialize(result)),
      total: total,
    });
  }
}
