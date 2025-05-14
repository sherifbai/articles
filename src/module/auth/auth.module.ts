import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { accessTokenConfig } from '../../common/config/app.config';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AccessTokenStrategy } from './stratigies/accessToken.strategy';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: accessTokenConfig,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
