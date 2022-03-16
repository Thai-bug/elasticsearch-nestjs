import {
  CACHE_MANAGER,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CategoryService } from '@Services/Category.service';
import { MyLogger } from '@Services/LoggerService';
import { response } from '@Utils/response.utils';
import { serialize } from 'class-transformer';
import { ILike } from 'typeorm';
import { hasRoles } from 'src/Auth/Decorators/Role.decorators';
import { JwtAuthGuard } from 'src/Auth/Guards/JwtGuard.guard';
import { RolesGuard } from 'src/Auth/Guards/Role.guard';
import { validate } from '@Utils/validate.utils';
import { ValidateCreateCategory, ValidateUpdateCategory } from '@Meta/Category.validate';
import axios from 'axios';

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
  
  @hasRoles('ADMIN', 'MANAGER', 'PRODUCT_MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/list')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCategoriesAdmin(@Request() request: Request) {
    const limit = +request['query']?.limit || 10;
    const offset = +request['query']?.offset || 0;
    const search = request['query']?.search || '';
    const [result, total] = await this.categoryService.getCategories({
      where: {
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

  @hasRoles('ADMIN', 'MANAGER', 'PRODUCT_MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('create')
  async createCategory(@Request() request: Request) {
    const validateRequest = await validate(ValidateCreateCategory, request['body']);

    if (validateRequest instanceof Error)
      return response(HttpStatus.BAD_REQUEST, validateRequest.message, null);

    const result = await this.categoryService.store(request['body']).catch(e=>e);

    switch (+result.code) {
      case 23505:
        return response(HttpStatus.BAD_REQUEST, 'Code is existed', null);
    
      default:
        break;
    }
      
    if (result instanceof Error)
      return response(HttpStatus.BAD_REQUEST, result.message, null);

    return response(200, 'success', result);
  }

  @hasRoles('ADMIN', 'MANAGER', 'PRODUCT_MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('update')
  async updateCategory(@Request() request: Request) {
    const validateRequest = await validate(ValidateUpdateCategory, request['body']);

    if (validateRequest instanceof Error)
      return response(HttpStatus.BAD_REQUEST, validateRequest.message, null);

    const result = await this.categoryService.update(
      validateRequest.id, validateRequest
    ).catch(e=>e);

    switch (+result.code) {
      case 23505:
        return response(HttpStatus.BAD_REQUEST, 'Code is existed', null);
    
      default:
        break;
    }
      
    if (result instanceof Error)
      return response(HttpStatus.BAD_REQUEST, result.message, null);

    return response(200, 'success', result);
  }

  @Post('demo')
  async demo(@Request() request: Request){
    const result = await axios.post('https://payment-dev.globalcare.vn', {...request.body});
    console.log(result);

    response(200, 'success', result);
  }
}
