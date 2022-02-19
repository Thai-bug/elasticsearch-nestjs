import {
  CACHE_MANAGER,
  HttpStatus,
  Inject,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { MyLogger } from '@Services/LoggerService';
import { UserService } from '@Services/UserService';
import { response } from '@Utils/response.utils';
import { verifyAToken } from '@Utils/token.utils';
import { Cache } from 'cache-manager';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  private logger: MyLogger = new MyLogger(UserMiddleware.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authentication = req.headers.authorization?.split(' ')[1];
    const cachedUser = await this.cacheManager.get(authentication);
    if (cachedUser) {
      req['user'] = cachedUser;
      return next();
    }

    const decodedToken = verifyAToken(authentication, 'access');
    if (decodedToken instanceof Error) {
      this.cacheManager.del(authentication);
      return response(HttpStatus.UNAUTHORIZED, 'Unauthorized', null);
    }

    const user = await this.userService.getUser({ id: decodedToken.id });
    delete user.password;

    req['user'] = user;

    this.cacheManager.set(authentication, user, {
      ttl: 60 * 30,
    });

    next();
  }
}
