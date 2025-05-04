import { ErrorDetailDto } from './error-detail.dto';

export class ErrorDto {
  timestamp: string;
  statusCode: number;
  error: string;
  errorCode?: string;
  code: string;
  message: string;
  details?: ErrorDetailDto[];
}
