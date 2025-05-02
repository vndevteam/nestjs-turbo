import { EmailField, PasswordField, StringField } from '@repo/api';
import { lowerCaseTransformer } from '@repo/nest-common';
import { Transform } from 'class-transformer';

export class CreateUserReqDto {
  @StringField()
  @Transform(lowerCaseTransformer)
  readonly username: string;

  @EmailField()
  readonly email: string;

  @PasswordField()
  readonly password: string;
}
