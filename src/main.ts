import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ServerConfigService } from './config/server.config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // cors config
  app.enableCors({ origin: '*' });
  // public files config
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'uploads'));
  // view engin config
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', 'views', 'components'));
  app.setViewEngine('hbs');
  // port config
  const port = ServerConfigService.port;
  await app.listen(port);
  Logger.log(`Application is running on : ${await app.getUrl()}`, 'Bootstrap');
}
bootstrap();
