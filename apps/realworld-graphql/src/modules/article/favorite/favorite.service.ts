import { ErrorCode } from '@/constants/error-code.constant';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationException } from '@repo/graphql/exceptions/validation.exception';
import { ArticleEntity, UserEntity } from '@repo/postgresql-typeorm';
import { Repository } from 'typeorm';
import { Article } from '../model/article.model';
@Injectable()
export class FavoriteService {
  private readonly logger = new Logger(FavoriteService.name);
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(
    slug: string,
    userId: number,
    shouldEagerLoad: boolean,
  ): Promise<Article> {
    const { user, article } = await this.validateAndGetUserArticle(
      slug,
      userId,
      shouldEagerLoad,
    );

    // Check if the user has already favorited the article
    const hasFavorited = article.favoritedBy.some(
      (favoritedBy) => favoritedBy.id === user.id,
    );

    if (!hasFavorited) {
      article.favoritedBy.push(user);
      await this.articleRepository.save(article);

      // If you want to use the raw query, you can use the following code
      // await this.dataSource
      //   .createQueryBuilder()
      //   .insert()
      //   .into('user_favorites')
      //   .values({
      //     article_id: article.id,
      //     user_id: user.id,
      //   })
      //   .execute();
    }

    return {
      ...article.toDto(Article),
      tagList: article?.tags?.map((tag) => tag.name).reverse() || [],
      favorited: true,
      favoritesCount: article.favoritedBy.length,
      ...(shouldEagerLoad && {
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image: article.author.image,
          following: article.author.followers.some(
            (follower) => follower.followerId === userId,
          ),
        },
      }),
    };
  }

  async delete(
    slug: string,
    userId: number,
    shouldEagerLoad: boolean,
  ): Promise<Article> {
    this.logger.log('Deleting favorite for article', slug);
    const { user, article } = await this.validateAndGetUserArticle(
      slug,
      userId,
      shouldEagerLoad,
    );

    // Check if the user has already favorited the article
    const hasFavorited = article.favoritedBy.some(
      (favoritedBy) => favoritedBy.id === user.id,
    );

    if (hasFavorited) {
      // Remove the user from the list of favorited users
      article.favoritedBy = article.favoritedBy.filter(
        (favoritedBy) => favoritedBy.id !== user.id,
      );

      await this.articleRepository.save(article);
    }

    return {
      ...article.toDto(Article),
      tagList: article?.tags?.map((tag) => tag.name).reverse() || [],
      favorited: false,
      favoritesCount: article.favoritedBy.length,
      ...(shouldEagerLoad && {
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image: article.author.image,
          following: article.author.followers.some(
            (follower) => follower.followerId === userId,
          ),
        },
      }),
    };
  }

  private async validateAndGetUserArticle(
    slug: string,
    userId: number,
    shouldEagerLoad: boolean,
  ): Promise<{ user: UserEntity; article: ArticleEntity }> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
    });
    let article: ArticleEntity;
    if (shouldEagerLoad) {
      article = await this.articleRepository.findOne({
        where: { slug },
        relations: ['author', 'author.followers', 'tags', 'favoritedBy'],
      });
    } else {
      article = await this.articleRepository.findOne({
        where: { slug },
        relations: ['tags', 'favoritedBy'],
      });
    }

    if (!article) {
      throw new ValidationException(ErrorCode.E201);
    }

    return { user, article };
  }
}
