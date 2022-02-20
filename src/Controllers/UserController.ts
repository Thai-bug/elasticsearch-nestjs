import { User } from '@Entities/User.entity';
import {
  Body,
  CACHE_MANAGER,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Req,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MyLogger } from '@Services/LoggerService';
import { generateAToken } from '@Utils/token.utils';
import { UserService } from 'src/Services/UserService';
import { response } from '@Utils/response.utils';
import { ILogin } from '@Interfaces/Meta/IUser.meta';
import { ValidateLogin, ValidateRegister } from '@Meta/User.validate';
import { validate } from '@Utils/validate.utils';
import { serialize } from 'class-transformer';
import { hasRoles } from 'src/Auth/Decorators/Role.decorators';
import { JwtAuthGuard } from 'src/Auth/Guards/JwtGuard.guard';
import { RolesGuard } from 'src/Auth/Guards/Role.guard';
import { randomString } from '@Utils/crypto';

@Controller('/api/v1/users')
export class UserController {
  private readonly logger = new MyLogger(UserController.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
  ) {}

  @Post('login')
  async login(@Body() info: ILogin) {
    const validateInfo = await validate(ValidateLogin, info);
    if (validateInfo instanceof Error)
      return response(HttpStatus.BAD_REQUEST, validateInfo.message, null);

    const user = await this.userService.login({ ...validateInfo });

    if (!user) {
      return response(404, 'invalid email or password', null);
    }

    return response(200, 'login successfully', {
      token: generateAToken(user, 'access'),
      refreshToken: generateAToken(user, 'refresh'),
    });
  }

  @Get('detail')
  @UseInterceptors(ClassSerializerInterceptor)
  async detail(@Req() request: Request) {
    const authorization = Object(request.headers).authorization.split(' ')[1];

    return response(200, 'success', await this.cacheManager.get(authorization));
  }

  @hasRoles('ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('list')
  @UseInterceptors(ClassSerializerInterceptor)
  async list() {
    const data = await this.userService.list({});

    return response(200, 'success', {
      data: JSON.parse(serialize(data[0])),
      total: data[1],
    });
  }

  @hasRoles('ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('create')
  async register(@Body() info: User) {
    const validateInfo = await validate(ValidateRegister, info);

    if (validateInfo instanceof Error)
      return response(HttpStatus.BAD_REQUEST, validateInfo.message, null);

    info.code = randomString().toUpperCase();
    const result = await this.userService.store(info);

    if (result instanceof Error)
      return response(HttpStatus.BAD_REQUEST, 'failed', null);

    return response(200, 'success', result);
  }
}
