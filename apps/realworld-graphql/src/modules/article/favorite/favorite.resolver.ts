import { Args, Info, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '@repo/graphql/decorators/current-user.decorator';
import { getFieldNames } from '@repo/graphql/utils/graphql-fields.util';
import type { GraphQLResolveInfo } from 'graphql';
import { Article } from '../model/article.model';
import { FavoriteService } from './favorite.service';

@Resolver(() => Article)
export class FavoriteResolver {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Mutation(() => Article, {
    name: 'favoriteArticle',
    description: 'Favorite an article',
  })
  async create(
    @CurrentUser('id') userId: number,
    @Args('slug') slug: string,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Article> {
    const requestedFields = getFieldNames(info);

    const shouldEagerLoad = ['favorited', 'favoritesCount'].every((field) =>
      requestedFields.includes(field),
    );

    return await this.favoriteService.create(slug, userId, shouldEagerLoad);
  }

  @Mutation(() => Article, {
    name: 'unfavoriteArticle',
    description: 'Unfavorite an article',
  })
  async delete(
    @CurrentUser('id') userId: number,
    @Args('slug') slug: string,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Article> {
    const requestedFields = getFieldNames(info);

    const shouldEagerLoad = ['favorited', 'favoritesCount'].every((field) =>
      requestedFields.includes(field),
    );

    return await this.favoriteService.delete(slug, userId, shouldEagerLoad);
  }
}
