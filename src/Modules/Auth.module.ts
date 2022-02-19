import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/Auth/Guards/JwtGuard.guard';
import { JwtStrategy } from 'src/Auth/Guards/JwtStrategy.guard';
import { RolesGuard } from 'src/Auth/Guards/Role.guard';
import { AuthService } from 'src/Auth/Services/Auth.service';
import { UsersModule } from './User.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
          secret: configService.get('ACCESS_KEY'),
          signOptions: { expiresIn: '1d' }
      })
  }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
