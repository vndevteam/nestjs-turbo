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
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@repo/api';
import { ApiAuth } from '@repo/api/decorators/http.decorators';
import { ArticleService } from './article.service';
import { ArticleListReqDto, ArticleListResDto } from './dto/article-list.dto';
import { ArticleResDto } from './dto/article.dto';
import { CreateArticleReqDto } from './dto/create-article.dto';

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
  async list(@Query() reqDto: ArticleListReqDto): Promise<ArticleListResDto> {
    return await this.articleService.list(reqDto);
  }

  @Get('feed')
  async feed() {
    return await this.articleService.feed();
  }

  @Get(':slug')
  async get(@Param('slug') slug: string) {
    return await this.articleService.get(slug);
  }

  @Post()
  @SerializeOptions({ type: ArticleResDto })
  @ApiAuth({
    summary: 'Create Article',
    type: ArticleResDto,
  })
  async create(
    @CurrentUser('id') userId: number,
    @Body('article') articleData: CreateArticleReqDto,
  ): Promise<ArticleResDto> {
    return await this.articleService.create(userId, articleData);
  }

  @Put(':slug')
  async update(@Param('slug') slug: string) {
    return await this.articleService.update(slug);
  }

  @Delete(':slug')
  async delete(@Param('slug') slug: string) {
    return await this.articleService.delete(slug);
  }
}
