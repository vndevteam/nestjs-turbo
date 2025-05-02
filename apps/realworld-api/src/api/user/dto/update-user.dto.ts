import { EmailFieldOptional, StringFieldOptional } from '@repo/api';
import { lowerCaseTransformer } from '@repo/nest-common';
import { Transform } from 'class-transformer';
import { IsUrl } from 'class-validator';

export class UpdateUserReqDto {
  @StringFieldOptional()
  @Transform(lowerCaseTransformer)
  readonly username: string;

  @EmailFieldOptional()
  readonly email: string;

  @StringFieldOptional({ minLength: 0 })
  readonly bio: string;

  @StringFieldOptional({ minLength: 0 })
  @IsUrl()
  readonly image: string;
}
