import {
  Controller,
  Delete,
  Param,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@repo/api';
import { ApiAuth } from '@repo/api/decorators/http.decorators';
import { ArticleResDto } from '../dto/article.dto';
import { FavoriteService } from './favorite.service';

@ApiTags('Favorite')
@Controller('articles/:slug/favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @SerializeOptions({ type: ArticleResDto })
  @ApiAuth({
    summary: 'Favorite Article',
    type: ArticleResDto,
  })
  async create(
    @CurrentUser('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResDto> {
    return await this.favoriteService.create(slug, userId);
  }

  @Delete()
  @SerializeOptions({ type: ArticleResDto })
  @ApiAuth({
    summary: 'Unfavorite Article',
    type: ArticleResDto,
  })
  async delete(
    @CurrentUser('id') userId: number,
    @Param('slug') slug: string,
  ): Promise<ArticleResDto> {
    return await this.favoriteService.delete(slug, userId);
  }
}
