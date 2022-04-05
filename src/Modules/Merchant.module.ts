import { MerchantController } from '@Controllers/Merchant.controller';
import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MerchantRepository } from '@Repositories/Merchant.repository';
import { MerchantProductRepository } from '@Repositories/MerchantProduct.repository';
import { ProductRepository } from '@Repositories/Product.repository';
import { MerchantService } from '@Services/Merchant.service';
import { MerchantProductService } from '@Services/MerchantProduct.service';
import { ProductService } from '@Services/Product.service';
import { UserService } from '@Services/User.service';
import { AuthModule } from './Auth.module';
import { UsersModule } from './User.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MerchantRepository,
      MerchantProductRepository,
      ProductRepository,
    ]),
    CacheModule.register(),
    AuthModule,
    UsersModule,
  ],
  exports: [
    TypeOrmModule,
    MerchantService,
    UserService,
    MerchantProductService,
    ProductService,
    AuthModule,
  ],
  providers: [
    MerchantService,
    UserService,
    MerchantProductService,
    ProductService,
  ],
  controllers: [MerchantController],
})
export class MerchantModule {
  configure(consumer: MiddlewareConsumer) {}
}
