import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APP_CONFIG_TOKEN, AppConfig } from './common/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      whitelist: true,
      transform: true,
    }),
  );
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const appConfig: AppConfig =
    configService.getOrThrow<AppConfig>(APP_CONFIG_TOKEN);

  const config = new DocumentBuilder().addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  app.listen(appConfig.port, appConfig.host).then(() => {
    console.log(`app run at http://${appConfig.host}:${appConfig.port}`);
    console.log(
      `api run at http://${appConfig.host}:${appConfig.port}/api/docs`,
    );
  });
}

void bootstrap();
