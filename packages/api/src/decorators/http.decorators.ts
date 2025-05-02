import {
  HttpCode,
  HttpStatus,
  type Type,
  applyDecorators,
} from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  type ApiResponseOptions,
  ApiSecurity,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthOptional, Public } from '@repo/nest-common';
import { STATUS_CODES } from 'http';
import { ErrorDto } from '../dto';
import { CursorPaginatedDto } from '../dto/cursor-pagination/paginated.dto';
import { OffsetPaginatedDto } from '../dto/offset-pagination/paginated.dto';
import { PagePaginatedDto } from '../dto/page-pagination/paginated.dto';

type ApiResponseType = number;
type ApiAuthType = 'basic' | 'api-key' | 'jwt';
type PaginationType = 'page' | 'offset' | 'cursor';

interface IApiOptions<T extends Type<any>> {
  type?: T;
  summary?: string;
  description?: string;
  errorResponses?: ApiResponseType[];
  statusCode?: HttpStatus;
  isPaginated?: boolean;
  paginationType?: PaginationType;
}

type IApiPublicOptions = IApiOptions<Type<any>>;

interface IApiAuthOptions extends IApiOptions<Type<any>> {
  auths?: ApiAuthType[];
  isAuthOptional?: boolean;
}

export const ApiPublic = (options: IApiPublicOptions = {}): MethodDecorator => {
  const defaultStatusCode = HttpStatus.OK;
  const defaultErrorResponses = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];
  const isPaginated = options.isPaginated || false;
  const ok = {
    type: options.type,
    description: options?.description ?? 'OK',
    paginationType: options.paginationType || 'offset',
  };

  const errorResponses = (options.errorResponses || defaultErrorResponses)?.map(
    (statusCode) =>
      ApiResponse({
        status: statusCode,
        type: ErrorDto,
        description: STATUS_CODES[statusCode],
      }),
  );

  return applyDecorators(
    Public(),
    ApiOperation({ summary: options?.summary }),
    HttpCode(options.statusCode || defaultStatusCode),
    isPaginated ? ApiPaginatedResponse(ok) : ApiOkResponse(ok),
    ...errorResponses,
  );
};

export const ApiAuth = (options: IApiAuthOptions = {}): MethodDecorator => {
  const defaultStatusCode = HttpStatus.OK;
  const defaultErrorResponses = [
    HttpStatus.BAD_REQUEST,
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
    HttpStatus.NOT_FOUND,
    HttpStatus.UNPROCESSABLE_ENTITY,
    HttpStatus.INTERNAL_SERVER_ERROR,
  ];
  const isPaginated = options.isPaginated || false;
  const ok = {
    type: options.type,
    description: options?.description ?? 'OK',
    paginationType: options.paginationType || 'offset',
  };
  const auths = options.auths || ['jwt'];

  const errorResponses = (options.errorResponses || defaultErrorResponses)?.map(
    (statusCode) =>
      ApiResponse({
        status: statusCode,
        type: ErrorDto,
        description: STATUS_CODES[statusCode],
      }),
  );

  const authDecorators = auths.map((auth) => {
    switch (auth) {
      case 'basic':
        return ApiBasicAuth();
      case 'api-key':
        return ApiSecurity('Api-Key');
      case 'jwt':
        return ApiBearerAuth();
    }
  });

  const additionalDecorators = [];
  if (options.isAuthOptional) {
    additionalDecorators.push(AuthOptional());
  }

  return applyDecorators(
    ApiOperation({ summary: options?.summary }),
    HttpCode(options.statusCode || defaultStatusCode),
    isPaginated
      ? ApiPaginatedResponse(ok)
      : options.statusCode === 201
        ? ApiCreatedResponse(ok)
        : ApiOkResponse(ok),
    ...authDecorators,
    ...errorResponses,
    ...additionalDecorators,
  );
};

const ApiPaginatedResponse = <T extends Type<any>>(options: {
  type: T;
  description?: string;
  paginationType?: PaginationType;
}): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(getPaginationSchema(options.paginationType), options.type),
    ApiOkResponse({
      description:
        options.description || `Paginated list of ${options.type.name}`,
      schema: {
        title: `PaginatedResponseOf${options.type.name}`,
        allOf: [
          {
            $ref: getSchemaPath(getPaginationSchema(options.paginationType)),
          },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        ],
      },
    } as ApiResponseOptions | undefined),
  );
};

const getPaginationSchema = (paginationType?: PaginationType) => {
  return paginationType === 'offset'
    ? OffsetPaginatedDto
    : paginationType === 'page'
      ? PagePaginatedDto
      : CursorPaginatedDto;
};
