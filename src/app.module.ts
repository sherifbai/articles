import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  accessTokenConfig,
  appConfig,
  DB_CONFIG_TOKEN,
  dbConfig,
} from './common/config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, accessTokenConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get(DB_CONFIG_TOKEN),
    }),
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
