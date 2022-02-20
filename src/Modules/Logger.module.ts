import { Module } from '@nestjs/common';
import { MyLogger } from '@Services/LoggerService';

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}
