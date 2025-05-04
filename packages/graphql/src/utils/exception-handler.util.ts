import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { STATUS_CODES } from 'http';
import { GraphqlErrorCode } from '../constants';
import { ErrorDetailDto, ErrorDto } from '../dto';

/**
 * Handles UnprocessableEntityException:
 * Check the request payload
 * Validate the input
 * @param exception UnprocessableEntityException
 * @returns ErrorDto
 */
export function handleUnprocessableEntityException(
  exception: UnprocessableEntityException,
): ErrorDto {
  const r = exception.getResponse() as { message: ValidationError[] };
  const statusCode = exception.getStatus();

  const errorRes = {
    timestamp: new Date().toISOString(),
    statusCode,
    error: STATUS_CODES[statusCode],
    code: GraphqlErrorCode.BAD_USER_INPUT,
    message: 'Validation failed',
    details: extractValidationErrorDetails(r.message),
  };

  return errorRes;
}

/**
 * Handles HttpException
 * @param exception HttpException
 * @returns ErrorDto
 */
export function handleHttpException(exception: HttpException): ErrorDto {
  const statusCode = exception.getStatus();
  const code =
    exception instanceof UnauthorizedException
      ? GraphqlErrorCode.UNAUTHENTICATED
      : GraphqlErrorCode.FAILED_PRECONDITION;
  const errorRes = {
    timestamp: new Date().toISOString(),
    statusCode,
    error: STATUS_CODES[statusCode],
    code,
    message: exception.message,
  };

  return errorRes;
}

/**
 * Handles generic errors
 * @param error Error
 * @returns ErrorDto
 */
export function handleError(error: Error): ErrorDto {
  const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  const errorRes = {
    timestamp: new Date().toISOString(),
    statusCode,
    error: STATUS_CODES[statusCode],
    code: GraphqlErrorCode.INTERNAL_SERVER_ERROR,
    message: error?.message || 'An unexpected error occurred',
  };

  return errorRes;
}

/**
 * Extracts error details from ValidationError[]
 * @param errors ValidationError[]
 * @returns ErrorDetailDto[]
 */
export function extractValidationErrorDetails(
  errors: ValidationError[],
): ErrorDetailDto[] {
  const extractErrors = (
    error: ValidationError,
    parentProperty: string = '',
  ): ErrorDetailDto[] => {
    const propertyPath = parentProperty
      ? `${parentProperty}.${error.property}`
      : error.property;

    const currentErrors: ErrorDetailDto[] = Object.entries(
      error.constraints || {},
    ).map(([code, message]) => ({
      property: propertyPath,
      code,
      message,
    }));

    const childErrors: ErrorDetailDto[] =
      error.children?.flatMap((childError) =>
        extractErrors(childError, propertyPath),
      ) || [];

    return [...currentErrors, ...childErrors];
  };

  return errors.flatMap((error) => extractErrors(error));
}
