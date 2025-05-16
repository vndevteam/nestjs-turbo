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

  @ResolveField(() => Profile)
  async author(@Parent() article: Article): Promise<Profile> {
    if (article.author) return article.author;
    const author = await this.dataLoader
      .getAuthorLoader()
      .load(article.authorId);
    const profile = author.toDto(Profile);
    profile.following =
      author?.following?.some(
        (followee) => followee.followeeId === article?.author?.id,
      ) || false;
    return profile;
  }

  @ResolveField(() => Boolean)
  async favorited(
    @Parent() article: Article,
    @CurrentUser('id') userId: number,
  ) {
    if (article.favorited !== undefined) return article.favorited;
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
    const { count } = await this.dataLoader
      .getFavoritesLoader(userId)
      .load(article.id);
    return count;
  }
}
