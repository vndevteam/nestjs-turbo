import { ConstraintErrors } from '@/constants/constraint-errors';
import { ErrorCode } from '@/constants/error-code.constant';
import { I18nTranslations } from '@/generated/i18n.generated';
import {
  type ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import {
  ErrorDto,
  GraphqlErrorCode,
  handleError,
  handleHttpException,
  handleUnprocessableEntityException,
  ValidationException,
} from '@repo/graphql';
import { GraphQLError } from 'graphql';
import { STATUS_CODES } from 'http';
import { I18nContext } from 'nestjs-i18n';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

@Catch()
export class GlobalGqlExceptionFilter implements GqlExceptionFilter {
  private i18n: I18nContext<I18nTranslations>;
  private readonly logger = new Logger(GlobalGqlExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    this.i18n = I18nContext.current<I18nTranslations>(host);
    let error: ErrorDto;

    const createGraphQLError = (message: string, error: ErrorDto) =>
      new GraphQLError(message, { extensions: { ...error } });

    if (exception instanceof UnprocessableEntityException) {
      error = handleUnprocessableEntityException(exception);
    } else if (exception instanceof ValidationException) {
      error = this.handleValidationException(exception);
    } else if (exception instanceof HttpException) {
      error = handleHttpException(exception);
    } else if (exception instanceof QueryFailedError) {
      this.logger.error(exception);
      error = this.handleQueryFailedError(exception);
    } else if (exception instanceof EntityNotFoundError) {
      this.logger.debug(exception);
      error = this.handleEntityNotFoundError(exception);
    } else {
      this.logger.error(exception);
      error = handleError(exception);
    }

    return createGraphQLError(exception.message, error);
  }

  /**
   * Handles validation errors
   * @param exception ValidationException
   * @returns ErrorDto
   */
  private handleValidationException(exception: ValidationException): ErrorDto {
    const r = exception.getResponse() as {
      errorCode: ErrorCode;
      message: string;
    };
    const statusCode = exception.getStatus();

    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode,
      error: STATUS_CODES[statusCode],
      errorCode:
        Object.keys(ErrorCode)[Object.values(ErrorCode).indexOf(r.errorCode)],
      code: GraphqlErrorCode.FAILED_PRECONDITION,
      message:
        r.message ||
        this.i18n.t(r.errorCode as unknown as keyof I18nTranslations),
    };

    return errorRes;
  }

  /**
   * Handles QueryFailedError
   * @param error QueryFailedError
   * @returns ErrorDto
   */
  private handleQueryFailedError(error: QueryFailedError): ErrorDto {
    const r = error as QueryFailedError & { constraint?: string };
    const { status, message } = r.constraint?.startsWith('UQ')
      ? {
          status: HttpStatus.CONFLICT,
          message: r.constraint
            ? this.i18n.t(
                (ConstraintErrors[r.constraint] ||
                  r.constraint) as keyof I18nTranslations,
              )
            : undefined,
        }
      : {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: this.i18n.t('app.common.internal_server_error'),
        };
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: STATUS_CODES[status],
      code:
        status === HttpStatus.CONFLICT
          ? GraphqlErrorCode.CONFLICT
          : GraphqlErrorCode.INTERNAL_SERVER_ERROR,
      message,
    } as unknown as ErrorDto;

    return errorRes;
  }

  /**
   * Handles EntityNotFoundError when using findOrFail() or findOneOrFail() from TypeORM
   * @param error EntityNotFoundError
   * @returns ErrorDto
   */
  private handleEntityNotFoundError(error: EntityNotFoundError): ErrorDto {
    const status = HttpStatus.NOT_FOUND;
    const errorRes = {
      timestamp: new Date().toISOString(),
      statusCode: status,
      error: STATUS_CODES[status],
      code: GraphqlErrorCode.NOT_FOUND,
      message: error.message,
    } as unknown as ErrorDto;

    return errorRes;
  }
}
