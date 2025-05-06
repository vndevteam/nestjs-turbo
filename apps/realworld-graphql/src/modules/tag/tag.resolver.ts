import { Query, Resolver } from '@nestjs/graphql';
import { Public } from '@repo/nest-common';
import { TagList } from './model/tag.model';
import { TagService } from './tag.service';

@Resolver()
export class TagResolver {
  constructor(private readonly tagService: TagService) {}

  @Public()
  @Query(() => TagList, { name: 'listTags' })
  async list(): Promise<TagList> {
    return await this.tagService.list();
  }
}
