import { registerAs } from '@nestjs/config';
import * as process from 'process';

export const APP_CONFIG_TOKEN = 'APP_CONFIG_TOKEN';

export const appConfig = registerAs(
  APP_CONFIG_TOKEN,
  (): AppConfig => ({
    host: process.env.APP_HOST || 'localhost',
    port: parseInt(process.env.APP_PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  }),
);

export type AppConfig = {
  host: string;
  port: number;
  nodeEnv: string;
};
