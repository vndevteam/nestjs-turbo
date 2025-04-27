import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  email: string;
}

@InputType()
export class UpdateUserInput {
  @Field(() => String)
  email: string;
}
