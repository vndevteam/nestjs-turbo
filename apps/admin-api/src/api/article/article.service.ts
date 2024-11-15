import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from '@repo/api/utils/offset-pagination';
import { ArticleEntity } from '@repo/database-typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { ArticleListReqDto, ArticleListResDto } from './dto/article-list.dto';
import { ArticleDto, ArticleResDto } from './dto/article.dto';
import { CreateArticleReqDto } from './dto/create-article.dto';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
  ) {}

  async list(reqDto: ArticleListReqDto): Promise<ArticleListResDto> {
    this.logger.log(reqDto);
    const qb = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.tags', 'tags');
    // .leftJoinAndSelect('article.favoritedBy', 'favoritedBy')
    // .innerJoin('favoritedBy.favorites', 'favorites');

    qb.where('1 = 1');

    if (reqDto.tag) {
      qb.where('tags.name = :tag', { tag: reqDto.tag });
    }

    if (reqDto.author) {
      qb.andWhere('author.username = :author', { author: reqDto.author });
    }

    // if (reqDto.favorited) {
    //   query.andWhere('favorites.username = :favorited', {
    //     favorited: reqDto.favorited,
    //   });
    // }

    qb.orderBy('article.createdAt', 'DESC');

    const [articles, metaDto] = await paginate<ArticleEntity>(qb, reqDto, {
      skipCount: false,
      takeAll: false,
    });

    console.log('articles', articles);
    console.log('metaDto', metaDto);
    console.log({
      articles: articles.map((article) => article.toDto(ArticleDto)),
      articlesCount: metaDto.totalRecords,
      pagination: metaDto,
    });

    return {
      articles: articles.map((article) => article.toDto(ArticleDto)),
      articlesCount: 0,
      pagination: metaDto,
    };
  }

  async feed() {
    throw new Error('Method not implemented.');
  }

  async get(_slug: string) {
    throw new Error('Method not implemented.');
  }

  async create(
    userId: number,
    articleData: CreateArticleReqDto,
  ): Promise<ArticleResDto> {
    const { title, description, body } = articleData;

    console.log(articleData);

    const newArticle = this.articleRepository.create({
      title,
      slug: slugify(title),
      description,
      body,
      authorId: userId,
      tags: articleData.tagList?.map((tag) => ({ name: tag })),
    });

    const savedArticle = await this.articleRepository.save(newArticle);

    return {
      article: {
        title: savedArticle.title,
        description: savedArticle.description,
        body: savedArticle.body,
        tagList: savedArticle.tags.map((tag) => tag.name),
      },
    };
  }

  async delete(_slug: string) {
    throw new Error('Method not implemented.');
  }

  async update(_slug: string) {
    throw new Error('Method not implemented.');
  }
}
