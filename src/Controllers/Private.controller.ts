import {
  CACHE_MANAGER,
  Controller,
  Get,
  Inject,
  Param,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { MyLogger } from '@Services/LoggerService';
import { hasRoles } from 'src/Auth/Decorators/Role.decorators';
import { JwtAuthGuard } from 'src/Auth/Guards/JwtGuard.guard';
import { RolesGuard } from 'src/Auth/Guards/Role.guard';
import { Cache } from 'cache-manager';
import { Response } from 'express';
import * as path from 'path';

@Controller('/api/v1/private')
export class PrivateController {
  private readonly logger = new MyLogger(PrivateController.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache, // private readonly categoryService: CategoryService,
  ) {}

  @hasRoles()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/:fileName')
  async getPrivateFile(@Param('fileName') fileName: any, @Res() res: Response) {
    return res.sendFile(
      path.join(process.cwd(), `private/static-files/${fileName}`),
    );
  }
}
