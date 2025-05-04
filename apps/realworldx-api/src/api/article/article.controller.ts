import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@repo/api';
import { ApiAuth } from '@repo/api/decorators/http.decorators';
import { ArticleService } from './article.service';
import { ArticleFeedReqDto } from './dto/article-feed.dto';
import { ArticleListReqDto, ArticleListResDto } from './dto/article-list.dto';
import { ArticleResDto } from './dto/article.dto';
import { CreateArticleReqDto } from './dto/create-article.dto';
import { UpdateArticleReqDto } from './dto/update-article.dto';

@ApiTags('Article')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @SerializeOptions({ type: ArticleListResDto })
  @ApiAuth({
    summary: 'List Articles',
    type: ArticleListResDto,
    isAuthOptional: true,
  })
  async list(
    @CurrentUser('id') userId: number,
    @Query() reqDto: ArticleListReqDto,
  ): Promise<ArticleListResDto> {
    return await this.articleService.list(reqDto, userId);
  }

  @Get('feed')
  @SerializeOptions({ type: ArticleListResDto })
  @ApiAuth({
    summary: 'Feed Articles',
    type: ArticleListResDto,
  })
  async getFeed(
    @CurrentUser('id') userId: number,
    @Query() reqDto: ArticleFeedReqDto,
  ): Promise<ArticleListResDto> {
    return await this.articleService.getFeed(userId, reqDto);
  }

  @Get(':slug')
  @SerializeOptions({ type: ArticleResDto })
  @ApiAuth({
    summary: 'Get Article',
    type: ArticleResDto,
    isAuthOptional: true,
  })
  async get(
    @CurrentUser('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResDto> {
    return await this.articleService.get(userId, slug);
  }

  @Post()
  @SerializeOptions({ type: ArticleResDto })
  @ApiAuth({
    summary: 'Create Article',
    type: ArticleResDto,
  })
  @ApiBody({
    description: 'Article create request',
    schema: {
      type: 'object',
      properties: {
        article: {
          type: 'object',
          $ref: '#/components/schemas/CreateArticleReqDto',
        },
      },
      required: ['article'],
    },
  })
  async create(
    @CurrentUser('id') userId: number,
    @Body('article') articleData: CreateArticleReqDto,
  ): Promise<ArticleResDto> {
    return await this.articleService.create(userId, articleData);
  }

  @Put(':slug')
  @SerializeOptions({ type: ArticleResDto })
  @ApiAuth({
    summary: 'Update Article',
    type: ArticleResDto,
  })
  @ApiBody({
    description: 'Article update request',
    schema: {
      type: 'object',
      properties: {
        article: {
          type: 'object',
          $ref: '#/components/schemas/UpdateArticleReqDto',
        },
      },
      required: ['article'],
    },
  })
  async update(
    @Param('slug') slug: string,
    @Body('article') articleData: UpdateArticleReqDto,
  ) {
    return await this.articleService.update(slug, articleData);
  }

  @Delete(':slug')
  @ApiAuth({
    summary: 'Delete Article',
  })
  async delete(@Param('slug') slug: string) {
    return await this.articleService.delete(slug);
  }
}
