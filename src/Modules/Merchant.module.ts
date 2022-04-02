import { MerchantController } from "@Controllers/Merchant.controller";
import { CacheModule, MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MerchantRepository } from "@Repositories/Merchant.repository";
import { MerchantService } from "@Services/Merchant.service";
import { UserService } from "@Services/User.service";
import { AuthModule } from "./Auth.module";
import { UsersModule } from "./User.module";


@Module({
  imports: [
    TypeOrmModule.forFeature([MerchantRepository]),
    CacheModule.register(),
    AuthModule,
    UsersModule,
  ],
  exports: [TypeOrmModule, MerchantService, UserService, AuthModule],
  providers: [MerchantService, UserService],
    controllers: [MerchantController],
})
export class MerchantModule {
  configure(consumer: MiddlewareConsumer) {}
}
