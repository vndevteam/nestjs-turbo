import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @Field(() => String)
  username: string;

  @Field(() => String)
  bio: string;

  @Field(() => String)
  image: string;

  @Field(() => Boolean)
  following: boolean;
}
