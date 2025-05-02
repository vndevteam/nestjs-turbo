import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC } from '../constants';

export const Public = () => SetMetadata(IS_PUBLIC, true);
