import { User } from '@Entities/User.entity';
import {
  ValidateCreateManufacture,
  ValidateUpdateManufacture,
} from '@Meta/Manufacture.validate';
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
import { ManufactureService } from '@Services/Manufacture.service';
import { response } from '@Utils/response.utils';
import { validate } from '@Utils/validate.utils';
import { Cache } from 'cache-manager';
import { serialize } from 'class-transformer';
import { hasRoles } from 'src/Auth/Decorators/Role.decorators';
import { CurrentUser } from 'src/Auth/Decorators/User.decorator';
import { JwtAuthGuard } from 'src/Auth/Guards/JwtGuard.guard';
import { RolesGuard } from 'src/Auth/Guards/Role.guard';
import { ILike } from 'typeorm';
import { getCurrentTime } from '@Utils/moment.utils';

@Controller('/api/v1/manufactures')
export class ManufactureController {
  private readonly logger = new MyLogger(ManufactureController.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly manufactureService: ManufactureService,
  ) {}

  @hasRoles('ADMIN', 'MANAGER', 'PRODUCT_MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  @UseInterceptors(ClassSerializerInterceptor)
  async createManufacture(
    @CurrentUser() user: User,
    @Request() request: Request,
  ) {
    const validateRequest = await validate(
      ValidateCreateManufacture,
      request.body,
    );

    if (validateRequest instanceof Error)
      return response(HttpStatus.BAD_REQUEST, validateRequest.message, null);

    validateRequest.metaInfo = {
      creator: JSON.parse(serialize(user)),
    };

    const result = await this.manufactureService
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

    return response(200, 'success', result);
  }

  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  async getManufactures(@Request() request: Request) {
    const limit = +request['query']?.limit || 10;
    const offset = +request['query']?.offset || 0;
    const search = request['query']?.search || '';
    const [result, total] = await this.manufactureService.getManufactures({
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
  @Get('')
  @UseInterceptors(ClassSerializerInterceptor)
  async getManufacturesAdmin(@Request() request: Request) {
    const limit = +request['query']?.limit || 10;
    const offset = +request['query']?.offset || 0;
    const search = request['query']?.search || '';
    const [result, total] = await this.manufactureService.getManufactures({
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
  async updateManufacture(
    @CurrentUser() user: User,
    @Request() request: Request,
  ) {
    const validateRequest = await validate(
      ValidateUpdateManufacture,
      request.body,
    );

    if (validateRequest instanceof Error)
      return response(HttpStatus.BAD_REQUEST, validateRequest.message, null);

    const manufacture = await this.manufactureService.findById(
      validateRequest.id as number,
    );

    if (!manufacture) {
      return response(HttpStatus.BAD_REQUEST, 'manufacture not found', null);
    }

    const updatedContent = JSON.parse(serialize(validateRequest));

    validateRequest.metaInfo = manufacture.metaInfo;

    if (!validateRequest.metaInfo?.editors) {
      manufacture.metaInfo.editors = [];
    }

    validateRequest.metaInfo.editors.unshift({
      editor: JSON.parse(serialize(user)),
      editedContent: updatedContent,
      editedAt: getCurrentTime(),
    });

    const result = await this.manufactureService
      .update(validateRequest.id, validateRequest)
      .catch((e) => e);

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
}
