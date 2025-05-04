import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@repo/api';
import { ApiAuth } from '@repo/api/decorators/http.decorators';
import { CommentService } from './comment.service';
import { CommentListResDto } from './dto/comment-list.dto';
import { CommentResDto } from './dto/comment.dto';
import { CreateCommentReqDto } from './dto/create-comment.dto';

@ApiTags('Comment')
@Controller('articles/:slug/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @SerializeOptions({ type: CommentResDto })
  @ApiAuth({
    summary: 'Add Comments to an Article',
    type: CommentResDto,
  })
  async create(
    @Param('slug') slug: string,
    @Body('comment') commentData: CreateCommentReqDto,
    @CurrentUser('id') userId: number,
  ): Promise<CommentResDto> {
    return await this.commentService.create(slug, commentData, userId);
  }

  @Get()
  @SerializeOptions({ type: CommentListResDto })
  @ApiAuth({
    summary: 'Get Comments from an Article',
    type: CommentListResDto,
    isAuthOptional: true,
  })
  async list(@Param('slug') slug: string): Promise<CommentListResDto> {
    return await this.commentService.list(slug);
  }

  @Delete(':id')
  @ApiAuth({
    summary: 'Delete Comment',
  })
  async delete(
    @CurrentUser('id') userId: number,
    @Param('id') commentId: number,
  ) {
    return await this.commentService.delete(commentId, userId);
  }
}
