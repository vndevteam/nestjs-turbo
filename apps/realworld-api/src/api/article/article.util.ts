import { ArticleEntity, UserEntity } from '@repo/mysql-typeorm';
import { ProfileDto } from '../profile/dto/profile.dto';
import { ArticleDto } from './dto/article.dto';

export function toArticleDto(
  article: ArticleEntity,
  user: UserEntity,
  fieldsToRemove: string[] = [],
): ArticleDto {
  const author = article?.author?.toDto(ProfileDto) || new ProfileDto();
  author.following =
    user?.following?.some(
      (followee) => followee.followeeId === article?.author?.id,
    ) || false;

  const articleDto = article?.toDto(ArticleDto) || new ArticleDto();
  articleDto.author = author;
  articleDto.tagList = article?.tags?.map((tag) => tag.name) || [];
  articleDto.favorited =
    article?.favoritedBy?.some((fUser) => fUser.id === user.id) || false;
  articleDto.favoritesCount = article?.favoritedBy?.length || 0;

  for (const field of fieldsToRemove) {
    delete articleDto[field];
  }

  return articleDto;
}
