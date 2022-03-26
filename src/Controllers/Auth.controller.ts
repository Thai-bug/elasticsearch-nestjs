import { ILogin } from '@Interfaces/Meta/IUser.meta';
import { ValidateLogin } from '@Meta/User.validate';
import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { MerchantUserService } from '@Services/MerchantUser.service';
import { UserService } from '@Services/User.service';
import { response } from '@Utils/response.utils';
import { generateAToken, verifyAToken } from '@Utils/token.utils';
import { validate } from '@Utils/validate.utils';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

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

  @Get('refresh-token')
  async refreshToken(@Request() req: any) {
    const token = req.headers.refresh;

    const decode = verifyAToken(token, 'refresh');
    if (!decode || decode instanceof Error)
      return response(HttpStatus.UNAUTHORIZED, 'invalid refresh token', null);

    const user = await this.userService.getUser({
      id: +decode.id,
      status: true,
    });
    if (!user)
      return response(HttpStatus.UNAUTHORIZED, 'invalid refresh token', null);

    return response(200, 'refresh token successfully', {
      refreshToken: generateAToken(user, 'refresh'),
    });
  }

  @Post('merchant/:merchantCode/login')
  async loginMerchant(
    @Param('merchantCode') merchantCode: Request,
    @Request() request: Request,
    @Body() info: ILogin,
  ) {
    const username = request.body['username'];
    const password = request.body['password'];

    // console.log(
    //   await this.merchantUserService.login({
    //     username: username,
    //   }),
    // );
  }
}
