import { ErrorCode } from '@/constants/error-code.constant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity, TagEntity, UserEntity } from '@repo/postgresql-typeorm';
import { I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';
import { Profile } from '../profile/model/profile.model';
import { Article } from './model/article.model';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly i18n: I18nService,
  ) {}

  async get(slug: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug: slug },
      relations: ['tags'],
    });

    if (!article) {
      throw new NotFoundException(this.i18n.t(ErrorCode.E201));
    }

    return {
      ...article.toDto(Article),
      tagList: article?.tags?.map((tag) => tag.name).reverse() || [],
    };
  }

  async getWithRelations(slug: string, userId: number): Promise<Article> {
    const user = await this.userRepository.findOneOrFail({
      where: { id: userId },
      relations: ['following'],
    });

    const article = await this.articleRepository.findOne({
      where: { slug: slug },
      relations: ['author', 'tags', 'favoritedBy'],
    });

    if (!article) {
      throw new NotFoundException(this.i18n.t(ErrorCode.E201));
    }

    const author = article?.author?.toDto(Profile) || new Profile();
    author.following =
      user?.following?.some(
        (followee) => followee.followeeId === article?.author?.id,
      ) || false;

    return {
      ...article.toDto(Article),
      author,
      tagList: article?.tags?.map((tag) => tag.name).reverse() || [],
      favorited:
        article?.favoritedBy?.some((fUser) => fUser.id === userId) || false,
      favoritesCount: article?.favoritedBy?.length || 0,
    };
  }
}
