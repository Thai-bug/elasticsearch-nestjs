import { Merchant } from '@Entities/Merchant.entity';
import { Product } from '@Entities/Product.entity';
import { User } from '@Entities/User.entity';
import {
  AddProductValidate,
  CreateMerchantUserValidate,
  ValidateCreateMerchant,
  ValidateUpdateMerchant,
} from '@Meta/Merchant.validate';
import {
  Body,
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
import { MerchantService } from '@Services/Merchant.service';
import { MerchantProductService } from '@Services/MerchantProduct.service';
import { ProductService } from '@Services/Product.service';
import { UserService } from '@Services/User.service';
import { hash } from '@Utils/bcrypt';
import { randomString } from '@Utils/crypto';
import { getCurrentTime } from '@Utils/moment.utils';
import { response } from '@Utils/response.utils';
import { validate } from '@Utils/validate.utils';
import { Cache } from 'cache-manager';
import { serialize } from 'class-transformer';
import { hasRoles } from 'src/Auth/Decorators/Role.decorators';
import { CurrentUser } from 'src/Auth/Decorators/User.decorator';
import { JwtAuthGuard } from 'src/Auth/Guards/JwtGuard.guard';
import { RolesGuard } from 'src/Auth/Guards/Role.guard';
import { getManager, ILike } from 'typeorm';

@Controller('/api/v1/merchants')
export class MerchantController {
  private readonly logger = new MyLogger(MerchantController.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly merchantService: MerchantService,
    private readonly userService: UserService,
    private readonly merchantProductService: MerchantProductService,
    private readonly productService: ProductService,
  ) { }

  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  async getMerchants(@Request() request: Request) {
    const limit = +request['query']?.limit || 10;
    const offset = +request['query']?.offset || 0;
    const search = request['query']?.search || '';
    const [result, total] = await this.merchantService.getMerchants({
      title: ILike(`%${search}%`),
      skip: offset,
      take: limit,
      status: true,
    });
    return response(HttpStatus.OK, 'successfully', {
      total,
      data: JSON.parse(serialize(result)),
    });
  }

  @hasRoles('ADMIN', 'MANAGER', 'PRODUCT_MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  async createMerchant(@CurrentUser() user: User, @Request() request: Request) {
    const data = request.body;

    const validateRequest = await validate(ValidateCreateMerchant, data);
    if (validateRequest instanceof Error) {
      return response(400, 'validation error', validateRequest.message);
    }

    validateRequest.metaInfo = {
      creator: JSON.parse(serialize(user)),
    };

    const merchant = this.merchantService.create(validateRequest);

    const result = await this.merchantService
      .store(merchant)
      .catch((err) => err);

    switch (+result.code) {
      case 23505:
        return response(HttpStatus.BAD_REQUEST, 'Code is existed', null);

      default:
        break;
    }
    if (result instanceof Error)
      return response(HttpStatus.BAD_REQUEST, result.message, null);

    return response(
      HttpStatus.OK,
      'successfully',
      JSON.parse(serialize(result)),
    );
  }

  @hasRoles('ADMIN, MANAGER, PRODUCT_MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('update')
  async updateMerchant(@CurrentUser() user: User, @Request() request: Request) {
    const data = request.body;

    const validateRequest = await validate(ValidateUpdateMerchant, data);
    if (validateRequest instanceof Error) {
      return response(400, 'validation error', validateRequest.message);
    }

    const merchant = await this.merchantService.findById(validateRequest.id);
    if (!merchant) {
      return response(HttpStatus.NOT_FOUND, 'merchant not found', null);
    }

    const updatedContent = JSON.parse(serialize(validateRequest));

    validateRequest.metaInfo = merchant.metaInfo;

    if (!validateRequest.metaInfo?.editors) {
      merchant.metaInfo.editors = [];
    }

    validateRequest.metaInfo.editors.unshift({
      editor: JSON.parse(serialize(user)),
      editedContent: updatedContent,
      editedAt: getCurrentTime(),
    });

    const result = await this.merchantService
      .update(validateRequest.id, validateRequest)
      .catch((err) => err);

    if (result instanceof Error)
      return response(HttpStatus.BAD_REQUEST, result.message, null);

    return response(HttpStatus.OK, 'successfully', result);
  }

  @hasRoles('ADMIN, MANAGER, PRODUCT_MANAGER, MERCHANT_ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/list')
  async getMerchantsForAdmin(@Request() request: Request) {
    const limit = +request['query']?.limit || 10;
    const offset = +request['query']?.offset || 0;
    const search = request['query']?.search || '';
    const [result, total] = await this.merchantService.getMerchants({
      title: ILike(`%${search}%`),
      skip: offset,
      take: limit,
    });
    return response(HttpStatus.OK, 'successfully', {
      total,
      data: result,
    });
  }

  @hasRoles('MERCHANT_ADMIN', 'MERCHANT_MANAGER', 'ADMIN')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/create-user')
  async addUserToMerchant(
    @CurrentUser() currentUser: User,
    @Body() user: User,
  ) {
    const validateRequest = await validate(CreateMerchantUserValidate, user);

    if (validateRequest instanceof Error)
      return response(HttpStatus.BAD_REQUEST, validateRequest.message, null);

    user.code = `${currentUser.merchant?.code}_${randomString().toUpperCase()}`;
    user.password = await hash(user.password);
    user.parent = currentUser;
    user.merchant = currentUser.merchant;

    let result = await this.userService.store(user);

    if (result instanceof Error)
      return response(HttpStatus.BAD_REQUEST, 'failed', null);

    return response(200, 'success', result);
  }

  @hasRoles('MERCHANT_ADMIN', 'MERCHANT_USER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/users/list')
  async listUsers(
    @CurrentUser() currentUser: User,
    @Request() request: Request,
  ) {
    const limit = +request['query'].limit || 10;
    const offset = +request['query'].page || 0;
    const search = request['query'].search || '';

    // const data = await this.userService.list(
    //   currentUser,
    //   { search },
    //   offset,
    //   limit,
    // );

    return response(200, 'success', {
      // data,
      // data: JSON.parse(serialize(data[0])),
      // total: data[1],
    });
  }

  @hasRoles('MERCHANT_MANAGER', 'MERCHANT_PRODUCT', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('/add-product')
  async addProduct(@Body() body: Request) {
    const validateRequest = await validate(AddProductValidate, body);

    if (validateRequest instanceof Error)
      return response(HttpStatus.BAD_REQUEST, validateRequest.message, null);

    if (
      validateRequest.toDate &&
      validateRequest.fromDate.isAfter(validateRequest.toDate)
    ) {
      return response(
        HttpStatus.BAD_REQUEST,
        'invalid fromDate',
        'fromDate must be before toDate',
      );
    }

    const product = await this.productService.getProduct({
      id: validateRequest.product.id,
      status: true,
    });

    if (!product || !product.category.status || !product.manufacture.status)
      return response(
        HttpStatus.BAD_REQUEST,
        'invalid product',
        'product is not valid',
      );

    await this.merchantProductService.cancelActive(
      validateRequest.merchant,
      validateRequest.product,
      validateRequest.fromDate,
    );

    const merchantProduct = this.merchantProductService.create(validateRequest);

    const result = await this.merchantProductService.store(merchantProduct);

    if (result instanceof Error)
      return response(HttpStatus.BAD_REQUEST, 'failed', result.message);

    return response(200, 'success', result);
  }
}
