import { BadRequestException } from '@nestjs/common';

/**
 * ValidationException used to throw validation errors with a custom error code and message.
 */
export class ValidationException extends BadRequestException {
  constructor(errorCode: unknown, message?: string) {
    super({ errorCode, message });
  }
}
