import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CategoryService } from '@Services/CategoryService';
import { UserService } from '@Services/UserService';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    return new Promise((resolve, reject) => {
      this.userService.findById(request.user.id).then((user) => {
        if(!user.status)
          return resolve(false);

        if(roles.indexOf('ANY') || roles.length === 0)
          return resolve(true);

        const hasRole = () => roles.indexOf(user.role.code) > -1;
        resolve(hasRole());
      });
    });
  }
}
