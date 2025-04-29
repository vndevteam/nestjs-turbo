import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationException } from '@repo/api';
import {
  ArticleEntity,
  CommentEntity,
  UserEntity,
} from '@repo/database-typeorm';
import { Repository } from 'typeorm';

import { CommentService } from './comment.service';
import { CreateCommentReqDto } from './dto/create-comment.dto';

describe('CommentService', () => {
  let service: CommentService;
  let articleRepository: Repository<ArticleEntity>;
  let userRepository: Repository<UserEntity>;
  let commentRepository: Repository<CommentEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOneByOrFail: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: {
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    articleRepository = module.get<Repository<ArticleEntity>>(
      getRepositoryToken(ArticleEntity),
    );
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
    commentRepository = module.get<Repository<CommentEntity>>(
      getRepositoryToken(CommentEntity),
    );
  });

  describe('create', () => {
    it('should create a comment successfully', async () => {
      const slug = 'test-article';
      const commentData: CreateCommentReqDto = { body: 'Test comment' };
      const userId = 1;

      jest
        .spyOn(articleRepository, 'findOneBy')
        .mockResolvedValue({ id: 1 } as ArticleEntity);
      jest.spyOn(userRepository, 'findOneByOrFail').mockResolvedValue({
        id: userId,
        toDto: jest.fn().mockReturnValue({ username: 'test-user' }),
      } as any);
      jest.spyOn(commentRepository, 'save').mockResolvedValue({
        id: 1,
        body: 'Test comment',
        articleId: 1,
        authorId: userId,
      } as CommentEntity);

      const result = await service.create(slug, commentData, userId);

      expect(result).toEqual({
        comment: {
          id: 1,
          body: 'Test comment',
          articleId: 1,
          authorId: userId,
          author: { username: 'test-user' },
        },
      });
    });

    it('should throw ValidationException if article does not exist', async () => {
      jest.spyOn(articleRepository, 'findOneBy').mockResolvedValue(null);

      await expect(
        service.create('invalid-slug', { body: 'Test comment' }, 1),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('list', () => {
    it('should return a list of comments', async () => {
      const slug = 'test-article';

      jest
        .spyOn(articleRepository, 'findOneBy')
        .mockResolvedValue({ id: 1 } as ArticleEntity);
      jest.spyOn(commentRepository, 'find').mockResolvedValue([
        {
          id: 1,
          body: 'Comment 1',
          author: { toDto: jest.fn().mockReturnValue({ username: 'user1' }) },
        },
        {
          id: 2,
          body: 'Comment 2',
          author: { toDto: jest.fn().mockReturnValue({ username: 'user2' }) },
        },
      ] as any);

      const result = await service.list(slug);

      expect(result).toEqual({
        comments: [
          { id: 1, body: 'Comment 1', author: { username: 'user1' } },
          { id: 2, body: 'Comment 2', author: { username: 'user2' } },
        ],
      });
    });

    it('should throw ValidationException if article does not exist', async () => {
      jest.spyOn(articleRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.list('invalid-slug')).rejects.toThrow(
        ValidationException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a comment successfully', async () => {
      const commentId = 1;
      const userId = 1;

      jest.spyOn(commentRepository, 'findOneBy').mockResolvedValue({
        id: commentId,
        authorId: userId,
      } as CommentEntity);
      jest.spyOn(commentRepository, 'remove').mockResolvedValue(undefined);

      await expect(service.delete(commentId, userId)).resolves.toBeUndefined();
    });

    it('should throw ValidationException if comment does not exist', async () => {
      jest.spyOn(commentRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.delete(1, 1)).rejects.toThrow(ValidationException);
    });

    it('should throw ValidationException if user is not the author', async () => {
      jest
        .spyOn(commentRepository, 'findOneBy')
        .mockResolvedValue({ id: 1, authorId: 2 } as CommentEntity);

      await expect(service.delete(1, 1)).rejects.toThrow(ValidationException);
    });
  });
});
