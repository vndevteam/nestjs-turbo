import compression from '@fastify/compress';
import helmet from '@fastify/helmet';
import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import {
  AsyncContextProvider,
  Environment,
  FastifyLoggerEnv,
  FastifyPinoLogger,
  fastifyPinoOptions,
  genReqId,
  REQUEST_ID_HEADER,
} from '@repo/nest-common';
import { AppModule } from './app.module';
import { AllConfigType } from './config/config.type';
import { GlobalGqlExceptionFilter } from './filters/global-gql-exception.filter';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './modules/auth/auth.service';

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

  // Get services
  const configService = app.get(ConfigService<AllConfigType>);
  const reflector = app.get(Reflector);

  // Configure the logger
  const asyncContext = app.get(AsyncContextProvider);
  const logger = new FastifyPinoLogger(
    asyncContext,
    fastifyAdapter.getInstance().log,
  );

  // If you want to use the console logger, uncomment the following code
  // const logger = new ConsoleLogger({
  //   ...(configService.getOrThrow('app.nodeEnv', { infer: true }) ===
  //     Environment.LOCAL && {
  //     colors: true,
  //   }),
  //   ...(configService.getOrThrow('app.nodeEnv', { infer: true }) !==
  //     Environment.LOCAL && {
  //     json: true,
  //   }),
  // });
  app.useLogger(logger);

  fastifyAdapter.getInstance().addHook('onRequest', (request, reply, done) => {
    asyncContext.run(() => {
      asyncContext.set('log', request.log);
      done();
    }, new Map());
  });

  // Setup security headers
  const devContentSecurityPolicy = {
    directives: {
      defaultSrc: ["'self'", 'https://sandbox.embed.apollographql.com'],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://unpkg.com',
        'https://embeddable-sandbox.cdn.apollographql.com',
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        'https://unpkg.com',
        'https://fonts.googleapis.com',
      ],
      imgSrc: [
        "'self'",
        'data:',
        'https://apollo-server-landing-page.cdn.apollographql.com',
      ],
    },
  };

  app.register(helmet, {
    contentSecurityPolicy:
      configService.getOrThrow('app.nodeEnv', { infer: true }) ===
      Environment.PRODUCTION
        ? undefined
        : devContentSecurityPolicy,
  });

  // For high-traffic websites in production, it is strongly recommended to offload compression from the application server - typically in a reverse proxy (e.g., Nginx). In that case, you should not use compression middleware.
  app.register(compression);

  // Enable CORS
  const corsOrigin = configService.getOrThrow('app.corsOrigin', {
    infer: true,
  });
  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  logger.log(`CORS Origin: ${corsOrigin.toString()}`);

  app.useGlobalGuards(new AuthGuard(reflector, app.get(AuthService)));

  app.useGlobalFilters(new GlobalGqlExceptionFilter());

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

  await app.listen(
    configService.getOrThrow('app.port', { infer: true }) as number,
    '0.0.0.0',
  );
}

bootstrap();
