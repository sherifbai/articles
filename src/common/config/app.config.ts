import { registerAs } from '@nestjs/config';
import * as process from 'process';
import { JwtModuleOptions } from '@nestjs/jwt';
import { CacheStore } from '@nestjs/common/cache';
import * as redisStore from 'cache-manager-ioredis';

export const APP_CONFIG_TOKEN = 'APP_CONFIG_TOKEN';
export const DB_CONFIG_TOKEN = 'DB_CONFIG_TOKEN';
export const CONFIG_ACCESS_TOKEN = 'CONFIG_ACCESS_TOKEN';
export const CONFIG_REDIS_TOKEN = 'CONFIG_REDIS_TOKEN';

export const appConfig = registerAs(
  APP_CONFIG_TOKEN,
  (): AppConfig => ({
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.APP_PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  }),
);

export const dbConfig = registerAs(
  DB_CONFIG_TOKEN,
  (): DbConfig => ({
    type: 'postgres',
    logging: process.env.NODE_ENV === 'development',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV === 'development',
    entities: ['dist/src/**/*.entity.js'],
    migrations: ['dist/src/database/migrations/*.js'],
  }),
);

export const accessTokenConfig = registerAs(
  CONFIG_ACCESS_TOKEN,
  (): JwtModuleOptions => ({
    global: true,
    secret: process.env.ACCESS_TOKEN_SECRET || 'secret',
    signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE || '24h' },
  }),
);

export const redisConfig = registerAs(
  CONFIG_REDIS_TOKEN,
  (): RedisConfig => ({
    store: redisStore,
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT) || 6379,
    ttl: (parseInt(process.env.REDIS_TTL, 10) || 60) * 1000,
  }),
);

export type AppConfig = {
  host: string;
  port: number;
  nodeEnv: string;
};

export type DbConfig = {
  type: 'postgres';
  logging: boolean;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  autoLoadEntities: boolean;
  synchronize: boolean;
  entities: string[];
  migrations: string[];
};

export type RedisConfig = {
  store: CacheStore;
  host: string;
  port: number;
  ttl: number;
};
