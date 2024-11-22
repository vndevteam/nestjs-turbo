import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { appConfig, Environment } from '@repo/api';
import { databaseConfig } from '@repo/mysql-typeorm';
import {
  AsyncContextProvider,
  FastifyPinoLogger,
  RequestIdMiddleware,
} from '@repo/nest-common';
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { ApiModule } from './api/api.module';
import authConfig from './api/auth/config/auth.config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AllConfigType } from './config/config.type';
import { TypeOrmConfigService } from './database/mysql-typeorm-config.service';

const configModule = ConfigModule.forRoot({
  isGlobal: true,
  load: [appConfig, databaseConfig, authConfig],
  envFilePath: ['.env'],
});

const dbModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    if (!options) {
      throw new Error('Invalid options passed');
    }

    return new DataSource(options).initialize();
  },
});

const i18nModule = I18nModule.forRootAsync({
  resolvers: [
    { use: QueryResolver, options: ['lang'] },
    AcceptLanguageResolver,
    new HeaderResolver(['x-lang']),
  ],
  useFactory: (configService: ConfigService<AllConfigType>) => {
    const env = configService.get('app.nodeEnv', { infer: true });
    const isLocal = env === Environment.LOCAL;
    const isDevelopment = env === Environment.DEVELOPMENT;
    return {
      fallbackLanguage: configService.getOrThrow('app.fallbackLanguage', {
        infer: true,
      }),
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: isLocal,
      },
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts',
      ),
      logging: isLocal || isDevelopment, // log info on missing keys
    };
  },
  inject: [ConfigService],
});

@Module({
  imports: [configModule, dbModule, i18nModule, ApiModule],
  controllers: [AppController],
  providers: [AppService, AsyncContextProvider, FastifyPinoLogger],
  exports: [AsyncContextProvider],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
