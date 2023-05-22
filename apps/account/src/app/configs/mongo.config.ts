import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

const getMongoConfig = (): MongooseModuleAsyncOptions => {
  return {
    useFactory: (configService: ConfigService) => ({
      uri: getMongoUri(configService),
    }),
    inject: [ConfigService],
    imports: [ConfigModule],
  };
};

const getMongoUri = (configService: ConfigService) =>
  'mongodb://' +
  configService.get('MONGO_LOGIN') +
  ':' +
  configService.get('MONGO_PASSWORD') +
  '@' +
  configService.get('MONGO_HOST') +
  ':' +
  configService.get('MONGO_PORT') +
  '/' +
  configService.get('MONGO_DATABASE') +
  '?authSource=' +
  configService.get('MONGO_AUTH_DATABASE');

export { getMongoConfig };
