import {
  Controller,
  Inject,
  CACHE_MANAGER,
  Get,
  UseGuards,
  Request,
  Post,
  Body
} from "@nestjs/common";
import { Cache } from 'cache-manager';
import { MyLogger } from "@Services/LoggerService";
import { hasRoles } from "src/Auth/Decorators/Role.decorators";
import { JwtAuthGuard } from "src/Auth/Guards/JwtGuard.guard";
import { RolesGuard } from "src/Auth/Guards/Role.guard";
import { CurrentUser } from "src/Auth/Decorators/User.decorator";
import { User } from "@Entities/User.entity";
import { OrderService } from "@Services/Order.service";
import { response } from "@Utils/response.utils";
import { serialize } from "class-transformer";
import { Order } from "@Entities/Order.entity";

@Controller(`/api/v1/orders`)
export class OrderController {
  private readonly logger = new MyLogger(OrderController.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly orderService: OrderService,
  ) { }

  @hasRoles('MERCHANT_MANAGER', 'ADMIN', 'MANAGER')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('')
  async getOrders(
    @CurrentUser() user: User,
    @Body() body: Request
  ) {
    const data = await this.orderService.getOrders(body as any);

    if(data instanceof Error){
      this.logger.error(data.message, data.stack, data.name);
      return response(500, 'Server Error', {
        data: [], 
        total: 0
      });
}

    return response(200, 'success', {
      data: JSON.parse(serialize(data)),
      // total: data[1],
    });
    return ;
  }
}