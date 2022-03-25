import { User } from '@Entities/User.entity';
import { ValidateCreateMerchant, ValidateUpdateMerchant } from '@Meta/Merchant.validate';
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
import { MerchantService } from '@Services/Merchant.service';
import { getCurrentTime } from '@Utils/moment.utils';
import { response } from '@Utils/response.utils';
import { validate } from '@Utils/validate.utils';
import { Cache } from 'cache-manager';
import { serialize } from 'class-transformer';
import { hasRoles } from 'src/Auth/Decorators/Role.decorators';
import { CurrentUser } from 'src/Auth/Decorators/User.decorator';
import { JwtAuthGuard } from 'src/Auth/Guards/JwtGuard.guard';
import { RolesGuard } from 'src/Auth/Guards/Role.guard';
import { ILike } from 'typeorm';

@Controller('/api/v1/merchants')
export class MerchantController {
  private readonly logger = new MyLogger(MerchantController.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly merchantService: MerchantService,
  ) {}

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
      status: true
    });
    return response(HttpStatus.OK, 'successfully', {
      total,
      data: JSON.parse(serialize(result)),
    });
  }

  @hasRoles('ADMIN, MANAGER, PRODUCT_MANAGER')
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

    const result = await this.merchantService
      .store(validateRequest)
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

    return response(
      HttpStatus.OK,
      'successfully',
      result,
    );
  }

  @hasRoles('ADMIN, MANAGER, PRODUCT_MANAGER')
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
}
