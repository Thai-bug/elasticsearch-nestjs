import {
  CacheModule,
  forwardRef,
  MiddlewareConsumer,
  Module,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './Auth.module';
import { MerchantUserRepository } from '@Repositories/MerchantUser.repository';
import { MerchantUserService } from '@Services/MerchantUser.service';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([MerchantUserRepository]),
    CacheModule.register(),
    
  ],
  exports: [TypeOrmModule, MerchantUserService],
  providers: [MerchantUserService],
})
export class MerchantUserModule {
  configure(consumer: MiddlewareConsumer) {}
}
