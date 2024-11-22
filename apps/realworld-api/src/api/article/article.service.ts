import { ErrorCode } from '@/constants/error-code.constant';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from '@repo/api/utils/offset-pagination';
import { ArticleEntity, TagEntity, UserEntity } from '@repo/mysql-typeorm';
import { I18nService } from 'nestjs-i18n';
import slugify from 'slugify';
import { In, Repository } from 'typeorm';
import { toArticleDto } from './article.util';
import { ArticleFeedReqDto } from './dto/article-feed.dto';
import { ArticleListReqDto, ArticleListResDto } from './dto/article-list.dto';
import { ArticleResDto } from './dto/article.dto';
import { CreateArticleReqDto } from './dto/create-article.dto';
import { UpdateArticleReqDto } from './dto/update-article.dto';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly i18n: I18nService,
  ) {}

  async list(
    reqDto: ArticleListReqDto,
    userId: number,
  ): Promise<ArticleListResDto> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['following'],
    });

    const qb = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoinAndSelect('article.favoritedBy', 'favoritedBy');

    qb.where('1 = 1');

    if (reqDto.tag) {
      qb.andWhere('tags.name LIKE :tag', { tag: `%${reqDto.tag}%` });
    }

    if (reqDto.author) {
      qb.andWhere('author.username = :author', { author: reqDto.author });
    }

    if (reqDto.favorited) {
      qb.andWhere('favoritedBy.username = :favorited', {
        favorited: reqDto.favorited,
      });
    }

    qb.orderBy('article.createdAt', 'DESC');

    const [articles, metaDto] = await paginate<ArticleEntity>(qb, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    const articleDtos = articles.map((article) =>
      toArticleDto(article, user, ['body']),
    );

    return {
      articles: articleDtos,
      articlesCount: metaDto.totalRecords,
      pagination: metaDto,
    };
  }

  async getFeed(
    userId: number,
    reqDto: ArticleFeedReqDto,
  ): Promise<ArticleListResDto> {
    const userWithFollowing = await this.userRepository.findOne({
      select: {
        id: true,
        following: {
          id: true,
          followeeId: true,
        },
      },
      where: { id: userId },
      relations: ['following'],
    });

    const followeeIds =
      userWithFollowing?.following?.map((f) => f.followeeId) || [];

    if (!followeeIds.length) {
      return {
        articles: [],
        articlesCount: 0,
        pagination: {
          limit: 0,
          offset: 0,
          totalRecords: 0,
          totalPages: 0,
        },
      };
    }

    const qb = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags')
      .leftJoinAndSelect('article.favoritedBy', 'favoritedBy')
      .where('article.authorId <> :userId', { userId })
      .andWhere('article.authorId IN (:...followeeIds)', {
        followeeIds,
      })
      .orderBy('article.createdAt', 'DESC');

    const [articles, metaDto] = await paginate<ArticleEntity>(qb, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    const articleDtos = articles.map((article) =>
      toArticleDto(article, userWithFollowing, ['body']),
    );

    return {
      articles: articleDtos,
      articlesCount: metaDto.totalRecords,
      pagination: metaDto,
    };
  }

  async get(userId: number, slug: string): Promise<ArticleResDto> {
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

    return {
      article: {
        ...toArticleDto(article, user),
        tagList: article.tags.map((tag) => tag.name),
        favorited: article.favoritedBy.some((user) => user.id === userId),
        favoritesCount: article.favoritedBy.length,
      },
    };
  }

  async create(
    userId: number,
    articleData: CreateArticleReqDto,
  ): Promise<ArticleResDto> {
    const { title, description, body, tagList } = articleData;
    const slug = await this.validateAndCreateSlug(title);
    const { existingTags, newTags } = await this.prepareTags(tagList);

    let savedArticle: ArticleEntity;
    await this.articleRepository.manager.transaction(async (manager) => {
      // Save new tags
      const savedNewTags = await manager.save(newTags);
      const allTags = [...existingTags, ...savedNewTags];

      // Save article
      const newArticle = new ArticleEntity({
        title,
        slug,
        description,
        body,
        authorId: userId,
        tags: allTags,
      });
      savedArticle = await manager.save(newArticle);
    });

    return {
      article: {
        slug: savedArticle.slug,
        title: savedArticle.title,
        description: savedArticle.description,
        body: savedArticle.body,
        tagList: savedArticle.tags.map((tag) => tag.name),
      },
    };
  }

  async delete(slug: string) {
    await this.articleRepository.delete({ slug: slug });
  }

  async update(
    reqSlug: string,
    articleData: UpdateArticleReqDto,
  ): Promise<ArticleResDto> {
    const article = await this.articleRepository.findOne({
      where: { slug: reqSlug },
    });

    if (!article) {
      throw new NotFoundException(this.i18n.t(ErrorCode.E201));
    }

    const { title, description, body, tagList } = articleData;
    const newSlug =
      reqSlug !== this.generateSlug(title)
        ? await this.validateAndCreateSlug(title)
        : reqSlug;
    const { existingTags, newTags } = await this.prepareTags(tagList);

    let savedArticle: ArticleEntity;
    await this.articleRepository.manager.transaction(async (manager) => {
      // Save new tags
      const savedNewTags = await manager.save(newTags);
      const allTags = [...existingTags, ...savedNewTags];

      // Save article
      const updatedArticle = Object.assign(article, {
        title,
        slug: newSlug,
        description,
        body,
        tags: allTags,
      });

      savedArticle = await manager.save(updatedArticle);
    });

    return {
      article: {
        slug: savedArticle.slug,
        title: savedArticle.title,
        description: savedArticle.description,
        body: savedArticle.body,
        tagList: savedArticle.tags.map((tag) => tag.name),
      },
    };
  }

  private async validateAndCreateSlug(title: string) {
    const slug = this.generateSlug(title);

    const existingArticle = await this.articleRepository.findOne({
      where: { slug },
    });

    if (existingArticle) {
      return `${slug}-${Date.now()}`;
    }

    return slug;
  }

  private generateSlug(title: string) {
    return slugify(title, {
      lower: true,
      strict: true,
    });
  }

  private async prepareTags(tagList: string[]) {
    const existingTags = await this.tagRepository.find({
      where: { name: In(tagList) },
    });

    const existingTagNames = existingTags.map((tag) => tag.name);

    const newTagNames = tagList.filter(
      (tag) => !existingTagNames.includes(tag),
    );
    const newTags = this.tagRepository.create(
      newTagNames.map((name) => ({ name })),
    );

    return { existingTags, newTags };
  }
}
