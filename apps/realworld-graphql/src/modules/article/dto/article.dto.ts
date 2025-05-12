import { ArgsType } from '@nestjs/graphql';
import { StringField } from '@repo/graphql';

@ArgsType()
export class SlugArgs {
  @StringField({
    description: 'Slug of the article',
  })
  slug: string;
}
