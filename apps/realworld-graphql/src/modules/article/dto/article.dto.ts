import { ArgsType, InputType, PartialType } from '@nestjs/graphql';
import { StringField, StringFieldOptional } from '@repo/graphql';

@ArgsType()
export class SlugArgs {
  @StringField({
    description: 'Slug of the article',
  })
  slug: string;
}

@InputType()
export class CreateArticleInput {
  @StringField({
    description: 'Title of the article',
  })
  title: string;

  @StringField({
    description: 'Description of the article',
  })
  description: string;

  @StringField({
    description: 'Body of the article',
  })
  body: string;

  @StringFieldOptional({
    description: 'Tag list of the article',
    each: true,
  })
  tagList?: string[];
}

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {}
