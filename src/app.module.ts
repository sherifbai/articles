import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  accessTokenConfig,
  appConfig,
  CONFIG_REDIS_TOKEN,
  DB_CONFIG_TOKEN,
  DbConfig,
  dbConfig,
  RedisConfig,
  redisConfig,
} from './common/config/app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './module/user/user.module';
import { AuthModule } from './module/auth/auth.module';
import { ArticleModule } from './module/article/article.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, dbConfig, accessTokenConfig, redisConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get<DbConfig>(DB_CONFIG_TOKEN),
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get<RedisConfig>(CONFIG_REDIS_TOKEN),
    }),
    UserModule,
    AuthModule,
    ArticleModule,
  ],
})
export class AppModule {}
