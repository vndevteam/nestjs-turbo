import { Profile } from '@/api/profile/model/profile.model';
import { Field, HideField, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Article {
  @HideField()
  id?: number;

  @Field(() => String)
  slug: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => String)
  body: string;

  @Field(() => [String])
  tagList: string[];

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Boolean, { nullable: true })
  favorited?: boolean;

  @Field(() => Number, { nullable: true })
  favoritesCount?: number;

  @Field(() => Profile, { nullable: true })
  author?: Profile;

  @HideField()
  authorId?: number;
}
