import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity, TagEntity, UserEntity } from '@repo/mysql-typeorm';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { CommentModule } from './comment/comment.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService],
  imports: [
    CommentModule,
    FavoriteModule,
    TypeOrmModule.forFeature([ArticleEntity, TagEntity, UserEntity]),
  ],
})
export class ArticleModule {}
