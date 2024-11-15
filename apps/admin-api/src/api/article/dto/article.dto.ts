import { ProfileDto } from '@/api/profile/dto/profile.dto';
import { Expose, Type } from 'class-transformer';

export class ArticleDto {
  @Expose()
  slug?: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  body: string;

  @Expose()
  tagList: string[];

  @Expose()
  createdAt?: Date;

  @Expose()
  updatedAt?: Date;

  @Expose()
  favorited?: boolean;

  @Expose()
  favoritesCount?: number;

  @Expose()
  @Type(() => ProfileDto)
  author?: ProfileDto;
}

export class ArticleResDto {
  @Expose()
  @Type(() => ArticleDto)
  article: ArticleDto;
}
