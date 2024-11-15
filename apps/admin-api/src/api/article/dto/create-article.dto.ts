import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StringField, StringFieldOptional } from '@repo/api';

export class CreateArticleReqDto {
  @ApiProperty()
  @StringField()
  title: string;

  @ApiProperty()
  @StringField()
  description: string;

  @ApiProperty()
  @StringField()
  body: string;

  @ApiPropertyOptional()
  @StringFieldOptional({ isArray: true })
  tagList?: string[];
}
