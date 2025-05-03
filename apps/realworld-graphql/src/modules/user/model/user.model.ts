import { Field, ObjectType } from '@nestjs/graphql';
@ObjectType()
export class User {
  @Field(() => String)
  email: string;

  @Field(() => String)
  token: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  bio: string;

  @Field(() => String)
  image: string;
}
