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
import { MyLogger } from '@Services/LoggerService';
import { ProductService } from '@Services/Product.service';
import { response } from '@Utils/response.utils';
import { serialize } from 'class-transformer';
import { ILike } from 'typeorm';
import { Cache } from 'cache-manager';
import { hasRoles } from 'src/Auth/Decorators/Role.decorators';
import { JwtAuthGuard } from 'src/Auth/Guards/JwtGuard.guard';
import { RolesGuard } from 'src/Auth/Guards/Role.guard';
import { validate } from '@Utils/validate.utils';
import {
  ValidateCreateProduct,
  ValidateUpdateProduct,
} from '@Meta/Product.validate';
import { CurrentUser } from 'src/Auth/Decorators/User.decorator';
import { User } from '@Entities/User.entity';
import { getCurrentTime } from '@Utils/moment.utils';

@Controller('/api/v1/products')
export class ProductController {
  private readonly logger = new MyLogger(ProductController.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly productService: ProductService,
  ) {}

  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCategories(@Request() request: Request) {
    const limit = +request['query']?.limit || 10;
    const offset = +request['query']?.offset || 0;
    const search = request['query']?.search || '';
    const [result, total] = await this.productService.getProducts({
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
  @Post('create')
  @UseInterceptors(ClassSerializerInterceptor)
  async createCategory(@CurrentUser() user: User, @Request() request: Request) {
    const body = request['body'];
    const validateRequest = await validate(ValidateCreateProduct, body);
    if (validateRequest instanceof Error) {
      return response(400, 'validation error', validateRequest);
    }

    validateRequest.metaInfo = {
      creator: JSON.parse(serialize(user)),
    };

    const result = await this.productService
      .store(validateRequest)
      .catch((e) => e);

    switch (+result.code) {
      case 23505:
        return response(HttpStatus.BAD_REQUEST, 'Code is existed', null);

      default:
        break;
    }

    if (result instanceof Error)
      return response(HttpStatus.BAD_REQUEST, result.message, null);

    return response(200, 'success', JSON.parse(serialize(result)));
  }

  @hasRoles('ADMIN', 'MANAGER', 'PRODUCT_MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/list')
  @UseInterceptors(ClassSerializerInterceptor)
  async getCategoriesAdmin(@Request() request: Request) {
    const limit = +request['query']?.limit || 10;
    const offset = +request['query']?.offset || 0;
    const search = request['query']?.search || '';
    const [result, total] = await this.productService.getProducts({
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
  @Post('update')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateProduct(@CurrentUser() user: User, @Request() request: Request) {
    const validateRequest = await validate(
      ValidateUpdateProduct,
      request['body'],
    );
    if (validateRequest instanceof Error)
      return response(400, 'validation error', validateRequest);

    const product = await this.productService.findById(validateRequest.id);
    if (!product)
      return response(HttpStatus.BAD_REQUEST, 'product not found', null);

    validateRequest.metaInfo = product.metaInfo;
    if (!validateRequest.metaInfo.editors) {
      validateRequest.metaInfo.editors = [];
    }

    validateRequest.metaInfo.editors.unshift({
      user: JSON.parse(serialize(user)),
      editedAt: getCurrentTime(),
    });

    const result = await this.productService
      .update(validateRequest.id, validateRequest)
      .catch((e) => e);
    if (result instanceof Error)
      return response(HttpStatus.BAD_REQUEST, result.message, null);

    return response(200, 'success', result);
  }
}
