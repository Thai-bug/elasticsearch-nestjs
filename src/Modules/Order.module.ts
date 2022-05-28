
import { OrderController } from '@Controllers/Order.controller';
import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderRepository } from '@Repositories/Order.repository';
import { ProductRepository } from '@Repositories/Product.repository';
import { MerchantService } from '@Services/Merchant.service';
import { OrderService } from '@Services/Order.service';
import { ProductService } from '@Services/Product.service';
import { UserService } from '@Services/User.service';
import { AuthModule } from './Auth.module';
import { UsersModule } from './User.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderRepository,
      ProductRepository,
    ]),
    CacheModule.register(),
    AuthModule,
    UsersModule,
  ],
  exports: [
    TypeOrmModule,
    // MerchantService,
    UserService,
    OrderService,
    ProductService,
    AuthModule,
  ],
  providers: [
    // MerchantService,
    UserService,
    OrderService,
    ProductService,
  ],
  controllers: [OrderController],
})
export class OrderModule {
  configure(consumer: MiddlewareConsumer) {}
}
