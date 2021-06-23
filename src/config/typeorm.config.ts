import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import * as config from 'config';

const dbConfig = config.get('db');

export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: process.env.DB_TYPE || dbConfig.type,
      host: process.env.DB_HOST || dbConfig.host,
      port: process.env.DB_PORT || dbConfig.port,
      username: process.env.DB_USERNAME || dbConfig.username,
      password: process.env.DB_PASSWORD || dbConfig.password,
      database: process.env.DB_NAME || dbConfig.database,
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: process.env.DB_SYNCHRONIZE || dbConfig.synchronize,
    };
  }
}
