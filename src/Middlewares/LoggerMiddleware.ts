import { Injectable, NestMiddleware } from '@nestjs/common';
import { MyLogger } from '@Services/LoggerService';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger: MyLogger = new MyLogger(LoggerMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
