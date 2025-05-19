import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity, TagEntity, UserEntity } from '@repo/postgresql-typeorm';
import { ArticleDataLoader } from './article.loader';
import { ArticleResolver } from './article.resolver';
import { ArticleService } from './article.service';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    FavoriteModule,
    TypeOrmModule.forFeature([ArticleEntity, TagEntity, UserEntity]),
  ],
  providers: [ArticleResolver, ArticleService, ArticleDataLoader],
  exports: [ArticleService],
})
export class ArticleModule {}
