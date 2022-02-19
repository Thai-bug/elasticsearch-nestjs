import { User } from '@Entities/User.entity';
import { Login } from '@Meta/User';
import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Post, Res, Response } from '@nestjs/common';
import { MyLogger } from '@Services/LoggerService';
import { generateAToken } from '@Utils/token.utils';
import { UserService } from 'src/Services/UserService';
import { response } from '@Utils/response.utils';

@Controller('/api/v1/users')
export class UserController {
  private readonly logger = new MyLogger(UserController.name);
  constructor(private readonly userService: UserService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() info: Login) {
    this.logger.log('/login', info);
    const user = await this.userService.login({ ...info });
    if (!user) {
      // return response(res, 404, 'Invalid username or password', {});
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }

    return response(res, 200, 'Login successfully', {
      token: generateAToken(user, 'access'),
      refreshToken: generateAToken(user, 'refresh'),
    });
  }
}
