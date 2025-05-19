import { Logger } from '@nestjs/common';
import {
  Args,
  Info,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CurrentUser, getFieldNames } from '@repo/graphql';
import type { GraphQLResolveInfo } from 'graphql';
import { Profile } from '../profile/model/profile.model';
import { ArticleDataLoader } from './article.loader';
import { ArticleService } from './article.service';
import {
  CreateArticleInput,
  SlugArgs,
  UpdateArticleInput,
} from './dto/article.dto';
import { Article } from './model/article.model';

@Resolver(() => Article)
export class ArticleResolver {
  private readonly logger = new Logger(ArticleResolver.name);
  constructor(
    private readonly articleService: ArticleService,
    private readonly dataLoader: ArticleDataLoader,
  ) {}

  @Query(() => Article, {
    name: 'article',
    description: 'Get an article by slug',
  })
  async get(
    @CurrentUser('id') userId: number,
    @Args() { slug }: SlugArgs,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Article> {
    this.logger.log('Getting article', slug);
    const requestedFields = getFieldNames(info);

    const shouldEagerLoad = ['author', 'favorited', 'favoritesCount'].every(
      (field) => requestedFields.includes(field),
    );

    if (shouldEagerLoad) {
      return await this.articleService.getWithRelations(slug, userId);
    }

    return await this.articleService.get(slug);
  }

  @Mutation(() => Article, { name: 'createArticle' })
  async create(
    @CurrentUser('id') userId: number,
    @Args('input') input: CreateArticleInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Article> {
    const requestedFields = getFieldNames(info);

    const shouldEagerLoad = ['author', 'favorited', 'favoritesCount'].every(
      (field) => requestedFields.includes(field),
    );

    return await this.articleService.create(userId, input, shouldEagerLoad);
  }

  @Mutation(() => Article, { name: 'updateArticle' })
  async update(
    @CurrentUser('id') userId: number,
    @Args('slug') slug: string,
    @Args('input') input: UpdateArticleInput,
    @Info() info: GraphQLResolveInfo,
  ): Promise<Article> {
    const requestedFields = getFieldNames(info);

    const shouldEagerLoad = ['author', 'favorited', 'favoritesCount'].every(
      (field) => requestedFields.includes(field),
    );

    return await this.articleService.update(
      userId,
      slug,
      input,
      shouldEagerLoad,
    );
  }

  @Mutation(() => Boolean, { name: 'deleteArticle' })
  async delete(@Args('slug') slug: string) {
    return await this.articleService.delete(slug);
  }

  @ResolveField(() => Profile)
  async author(
    @CurrentUser('id') userId: number,
    @Parent() article: Article,
  ): Promise<Profile> {
    if (article.author) return article.author;
    this.logger.log('Getting author for article', article.id);
    const author = await this.dataLoader
      .getAuthorLoader()
      .load(article.authorId);
    const profile = author.toDto(Profile);
    profile.following =
      author?.followers?.some((follower) => follower.followerId === userId) ||
      false;
    return profile;
  }

  @ResolveField(() => Boolean)
  async favorited(
    @Parent() article: Article,
    @CurrentUser('id') userId: number,
  ) {
    if (article.favorited !== undefined) return article.favorited;
    this.logger.log('Getting favorited for article', article.id);
    const { favorited } = await this.dataLoader
      .getFavoritesLoader(userId)
      .load(article.id);
    return favorited;
  }

  @ResolveField(() => Number)
  async favoritesCount(
    @Parent() article: Article,
    @CurrentUser('id') userId: number,
  ) {
    if (article.favoritesCount !== undefined) return article.favoritesCount;
    this.logger.log('Getting favorites count for article', article.id);
    const { count } = await this.dataLoader
      .getFavoritesLoader(userId)
      .load(article.id);
    return count;
  }
}
