import { ErrorCode } from '@/constants/error-code.constant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticleEntity, TagEntity, UserEntity } from '@repo/postgresql-typeorm';
import { I18nService } from 'nestjs-i18n';
import slugify from 'slugify';
import { In, Repository } from 'typeorm';
import { Profile } from '../profile/model/profile.model';
import { CreateArticleInput, UpdateArticleInput } from './dto/article.dto';
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

  async create(
    userId: number,
    input: CreateArticleInput,
    shouldEagerLoad: boolean,
  ): Promise<Article> {
    const { title, description, body, tagList } = input;
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

    let article: ArticleEntity;
    if (shouldEagerLoad) {
      article = await this.articleRepository.findOne({
        where: { id: savedArticle.id },
        relations: ['author', 'author.followers', 'tags', 'favoritedBy'],
      });
    } else {
      article = await this.articleRepository.findOne({
        where: { id: savedArticle.id },
        relations: ['tags'],
      });
    }

    return {
      ...article.toDto(Article),
      tagList: article?.tags?.map((tag) => tag.name).reverse() || [],
      ...(shouldEagerLoad && {
        author: {
          username: article.author.username,
          bio: article.author.bio,
          image: article.author.image,
          following: article.author.followers.some(
            (follower) => follower.followerId === userId,
          ),
        },
        favorited: article.favoritedBy.some((user) => user.id === userId),
        favoritesCount: article.favoritedBy.length,
      }),
    };
  }

  async update(
    userId: number,
    reqSlug: string,
    input: UpdateArticleInput,
    shouldEagerLoad: boolean,
  ): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug: reqSlug },
    });

    if (!article) {
      throw new NotFoundException(this.i18n.t(ErrorCode.E201));
    }

    const { title, description, body, tagList = [] } = input;
    const newSlug =
      title && reqSlug !== this.generateSlug(title)
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

    let newArticle: ArticleEntity;
    if (shouldEagerLoad) {
      newArticle = await this.articleRepository.findOne({
        where: { id: savedArticle.id },
        relations: ['author', 'author.followers', 'tags', 'favoritedBy'],
      });
    } else {
      newArticle = await this.articleRepository.findOne({
        where: { id: savedArticle.id },
        relations: ['tags'],
      });
    }

    return {
      ...newArticle.toDto(Article),
      tagList: newArticle?.tags?.map((tag) => tag.name).reverse() || [],
      ...(shouldEagerLoad && {
        author: {
          username: newArticle.author.username,
          bio: newArticle.author.bio,
          image: newArticle.author.image,
          following: newArticle.author.followers.some(
            (follower) => follower.followerId === userId,
          ),
        },
        favorited: newArticle.favoritedBy.some((user) => user.id === userId),
        favoritesCount: newArticle.favoritedBy.length,
      }),
    };
  }

  async delete(slug: string) {
    const result = await this.articleRepository.delete({ slug: slug });
    if (result.affected === 0) {
      throw new NotFoundException(this.i18n.t(ErrorCode.E201));
    }

    return true;
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

  private async prepareTags(tagList: string[] = []) {
    if (!tagList || tagList.length === 0) {
      return { existingTags: [], newTags: [] };
    }

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
