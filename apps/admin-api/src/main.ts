import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import {
  ClassSerializerInterceptor,
  HttpStatus,
  RequestMethod,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  AsyncContextProvider,
  FastifyLoggerEnv,
  FastifyPinoLogger,
  fastifyPinoOptions,
  genReqId,
  REQUEST_ID_HEADER,
} from '@repo/nest-common';
import { AuthService } from './api/auth/auth.service';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { AuthGuard } from './guards/auth.guard';
import { setupSwagger } from './utils/setup-swagger';

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter({
    requestIdHeader: REQUEST_ID_HEADER,
    genReqId: genReqId(),
    logger: fastifyPinoOptions(process.env.NODE_ENV as FastifyLoggerEnv),
  });

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    {
      bufferLogs: true,
    },
  );

  // Configure the logger
  const asyncContext = app.get(AsyncContextProvider);
  const logger = new FastifyPinoLogger(
    asyncContext,
    fastifyAdapter.getInstance().log,
  );
  app.useLogger(logger);

  fastifyAdapter.getInstance().addHook('onRequest', (request, reply, done) => {
    asyncContext.run(() => {
      asyncContext.set('log', request.log);
      done();
    }, new Map());
  });

  // Setup security headers
  app.register(helmet);

  // For high-traffic websites in production, it is strongly recommended to offload compression from the application server - typically in a reverse proxy (e.g., Nginx). In that case, you should not use compression middleware.
  app.register(compression);

  const configService = app.get(ConfigService<AllConfigType>);
  const reflector = app.get(Reflector);

  // Enable CORS
  const corsOrigin = configService.getOrThrow('app.corsOrigin', {
    infer: true,
  });
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials: true,
  });
  logger.log(`CORS Origin: ${corsOrigin.toString()}`);

  // Use global prefix if you don't have subdomain
  app.setGlobalPrefix(
    configService.getOrThrow('app.apiPrefix', { infer: true }),
    {
      exclude: [
        // { method: RequestMethod.GET, path: '/' }, // Middeware not working when using exclude by root path https://github.com/nestjs/nest/issues/13401
        { method: RequestMethod.GET, path: 'health' },
      ],
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalGuards(new AuthGuard(reflector, app.get(AuthService)));
  app.useGlobalFilters(
    new GlobalExceptionFilter(
      app.get(HttpAdapterHost),
      configService.getOrThrow('app.debug', { infer: true }),
    ),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errors);
      },
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(reflector, {
      excludeExtraneousValues: true,
    }),
  );

  if (configService.getOrThrow('app.apiDocsEnabled', { infer: true })) {
    setupSwagger(app);
  }

  await app.listen(configService.getOrThrow('app.port', { infer: true }));
}

bootstrap();
