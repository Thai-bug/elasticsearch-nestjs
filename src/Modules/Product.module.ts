import { ProductController } from '@Controllers/Product.controller';
import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductRepository } from '@Repositories/Product.repository';
import { ProductService } from '@Services/Product.service';
import { AuthModule } from './Auth.module';
import { UsersModule } from './User.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductRepository]),
    CacheModule.register(),
    AuthModule,
    UsersModule,
  ],
  exports: [TypeOrmModule, ProductService, AuthModule],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {
  configure(consumer: MiddlewareConsumer) {}
}
