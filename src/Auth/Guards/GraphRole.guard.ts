import { User } from '@Entities/User.entity';
import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CategoryService } from '@Services/Category.service';
import { UserService } from '@Services/User.service';
import { Observable } from 'rxjs';

@Injectable()
export class GraphRolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }


    const request = ctx.getContext().req.user as User;

    return new Promise((resolve, reject) => {
      this.userService.findById(request.id).then((user) => {
        if (!user.status) return resolve(false);

        if (roles.indexOf('ANY') > 1 || roles.length === 0) return resolve(true);

        const hasRole = () => roles.indexOf(user.role.code) > -1;
        resolve(hasRole());
      });
    });
  }
}
