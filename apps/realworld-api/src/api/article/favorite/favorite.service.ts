import { ErrorCode } from '@/constants/error-code.constant';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ValidationException } from '@repo/api';
import { ArticleEntity, UserEntity } from '@repo/mysql-typeorm';
import { Repository } from 'typeorm';
import { toArticleDto } from '../article.util';
import { ArticleResDto } from '../dto/article.dto';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(slug: string, userId: number): Promise<ArticleResDto> {
    const { user, article } = await this.validateAndGetUserArticle(
      slug,
      userId,
    );

    // Check if the user has already favorited the article
    const hasFavorited = article.favoritedBy.some(
      (favoritedBy) => favoritedBy.id === user.id,
    );

    if (!hasFavorited) {
      article.favoritedBy.push(user);
      await this.articleRepository.save(article);
    }

    return {
      article: {
        ...toArticleDto(article, user),
        tagList: article.tags.map((tag) => tag.name),
        favorited: true,
        favoritesCount: article.favoritedBy.length,
      },
    };
  }

  async delete(slug: string, userId: number): Promise<ArticleResDto> {
    const { user, article } = await this.validateAndGetUserArticle(
      slug,
      userId,
    );

    // Remove the user from the list of favorited users
    article.favoritedBy = article.favoritedBy.filter(
      (favoritedBy) => favoritedBy.id !== user.id,
    );

    await this.articleRepository.save(article);

    return {
      article: {
        ...toArticleDto(article, user),
        tagList: article.tags.map((tag) => tag.name),
        favorited: false,
        favoritesCount: article.favoritedBy.length,
      },
    };
  }

  private async validateAndGetUserArticle(
    slug: string,
    userId: number,
  ): Promise<{ user: UserEntity; article: ArticleEntity }> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: ['following'],
    });
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['favoritedBy', 'tags', 'author'],
    });

    if (!article) {
      throw new ValidationException(ErrorCode.E201);
    }

    return { user, article };
  }
}
