import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Profile {
  @HideField()
  id?: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  bio: string;

  @Field(() => String)
  image: string;

  @Field(() => Boolean)
  following: boolean;
}
