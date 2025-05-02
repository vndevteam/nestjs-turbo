import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field(() => String)
  readonly email: string;

  @Field(() => String)
  readonly password: string;
}
