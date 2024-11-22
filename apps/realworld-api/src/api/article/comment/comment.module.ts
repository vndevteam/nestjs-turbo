import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity, CommentEntity, UserEntity } from '@repo/mysql-typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleEntity, UserEntity, CommentEntity]),
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
