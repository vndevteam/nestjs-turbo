import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TagList {
  @Field(() => [String], { description: 'List of tags' })
  tags: string[];
}
