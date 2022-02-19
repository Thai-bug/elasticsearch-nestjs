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
  UseInterceptors,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { MyLogger } from '@Services/LoggerService';
import { generateAToken } from '@Utils/token.utils';
import { UserService } from 'src/Services/UserService';
import { response } from '@Utils/response.utils';
import { ILogin } from '@Interfaces/Meta/IUser.meta';
import { ValidateLogin } from '@Meta/User.validate';
import { validate } from '@Utils/validate.utils';
import { serialize } from 'class-transformer';

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
  async detail(@Req() request: Request) {
    const authorization = Object(request.headers).authorization.split(' ')[1];

    return response(200, 'success', await this.cacheManager.get(authorization));
  }

  @Get('list')
  @UseInterceptors(ClassSerializerInterceptor)
  async list() {
    const data = await this.userService.list({});

    return response(200, 'success', {
      data: JSON.parse(serialize(data[0])),
      total: data[1],
    });
  }
}
