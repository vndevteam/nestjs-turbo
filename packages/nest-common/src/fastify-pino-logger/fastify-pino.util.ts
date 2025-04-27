import { FastifyLoggerOptions, PinoLoggerOptions } from 'fastify/types/logger';
import hyperid from 'hyperid';

export const REQUEST_ID_HEADER = 'X-Request-Id';

export type FastifyLoggerEnv =
  | 'local'
  | 'development'
  | 'staging'
  | 'production';

const developmentLogger = (): any => {
  return {
    messageKey: 'msg',
    errorKey: 'err',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        singleLine: true,
      },
    },
    level: 'debug',
    serializers: {
      req: (req) => ({
        method: req.method,
        url: req.url,
        id: req.id,
        path: req.routeOptions.url,
        parameters: req.params,
        headers: req.headers,
      }),
      res(reply) {
        return {
          statusCode: reply.statusCode,
        };
      },
    },
    customSuccessMessage,
    customReceivedMessage,
    customErrorMessage,
    redact: {
      paths: [
        'req.headers.authorization',
        'req.body.token',
        'req.body.refreshToken',
        'req.body.email',
        'req.body.password',
        'req.body.oldPassword',
      ],
      censor: '**GDPR COMPLIANT**',
    },
  } as FastifyLoggerOptions & PinoLoggerOptions;
};

const customSuccessMessage = (req: any, res: any, responseTime: number) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - ${responseTime} ms`;
};

const customReceivedMessage = (req: any) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}"`;
};

const customErrorMessage = (req: any, res: any, err: any) => {
  return `[${req.id || '*'}] "${req.method} ${req.url}" ${res.statusCode} - "${req.headers['host']}" "${req.headers['user-agent']}" - message: ${err.message}`;
};

export function genReqId() {
  return (req: any) => req.headers[REQUEST_ID_HEADER] || hyperid().uuid;
}

export function fastifyPinoOptions(
  env: FastifyLoggerEnv,
): (FastifyLoggerOptions & PinoLoggerOptions) | boolean {
  const envToLogger = {
    local: developmentLogger(),
    development: developmentLogger(),
    production: {
      level: 'debug',
    },
    staging: {
      level: 'debug',
    },
  } as const;

  return envToLogger[env] ?? true;
}
