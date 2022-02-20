import { CategoryController } from '@Controllers/Category.controller';
import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from '@Repositories/Category.repository';
import { CategoryService } from '@Services/CategoryService';
import { AuthModule } from './Auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository]),
    CacheModule.register(),
    AuthModule,
  ],
  exports: [TypeOrmModule, CategoryService, AuthModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {
  configure(consumer: MiddlewareConsumer) {}
}
