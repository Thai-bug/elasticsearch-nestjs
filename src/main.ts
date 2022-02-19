import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MyLogger } from '@Services/LoggerService';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    // bufferLogs: true
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
