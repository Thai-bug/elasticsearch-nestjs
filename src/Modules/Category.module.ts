import { CategoryController } from '@Controllers/Category.controller';
import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryRepository } from '@Repositories/Category.repository';
import { CategoryService } from '@Services/Category.service';
import { AuthModule } from './Auth.module';
import { UsersModule } from './User.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CategoryRepository]),
    CacheModule.register(),
    AuthModule,
    UsersModule
  ],
  exports: [TypeOrmModule, CategoryService, AuthModule],
  providers: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {
  configure(consumer: MiddlewareConsumer) {}
}
