import { SetMetadata } from '@nestjs/common';
import { IS_AUTH_OPTIONAL } from '../constants';

export const AuthOptional = () => SetMetadata(IS_AUTH_OPTIONAL, true);
