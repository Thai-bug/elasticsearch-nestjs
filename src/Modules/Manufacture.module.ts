import { ManufactureController } from '@Controllers/Manufacture.controller';
import { CacheModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ManufactureRepository } from '@Repositories/Manufacture.repository';
import { ManufactureService } from '@Services/Manufacture.service';
import { AuthModule } from './Auth.module';
import { UsersModule } from './User.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ManufactureRepository]),
    CacheModule.register(),
    AuthModule,
    UsersModule
  ],
  exports: [TypeOrmModule, ManufactureService, AuthModule],
  providers: [ManufactureService],
  controllers: [ManufactureController],
})
export class ManufactureModule {
  configure(consumer: MiddlewareConsumer) {}
}
