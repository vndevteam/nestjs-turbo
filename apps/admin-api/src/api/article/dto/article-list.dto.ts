import { ApiProperty } from '@nestjs/swagger';
import { NumberFieldOptional } from '@repo/api';
import { OffsetPaginationDto } from '@repo/api/dto/offset-pagination/offset-pagination.dto';
import { PageOptionsDto } from '@repo/api/dto/offset-pagination/page-options.dto';
import { Expose, Type } from 'class-transformer';
import { ArticleDto } from './article.dto';

export class ArticleListReqDto extends PageOptionsDto {
  readonly tag?: string;
  readonly author?: string;
  readonly favorited?: string;

  @NumberFieldOptional({
    minimum: 1,
    default: 20,
    int: true,
  })
  override readonly limit: number = 20;

  @NumberFieldOptional({
    minimum: 0,
    default: 0,
    int: true,
  })
  override readonly offset: number = 0;
}

export class ArticleListResDto {
  @ApiProperty({ type: [ArticleDto] })
  @Expose()
  @Type(() => ArticleDto)
  articles: ArticleDto[];

  @ApiProperty()
  @Expose()
  articlesCount: number;

  @ApiProperty({ type: OffsetPaginationDto })
  @Expose()
  @Type(() => OffsetPaginationDto)
  pagination: OffsetPaginationDto;
}
