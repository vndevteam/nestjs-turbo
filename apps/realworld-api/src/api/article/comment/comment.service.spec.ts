import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ValidationException } from '@repo/api';
import {
  ArticleEntity,
  CommentEntity,
  UserEntity,
} from '@repo/postgresql-typeorm';

import { CommentService } from './comment.service';
import { CreateCommentReqDto } from './dto/create-comment.dto';

describe('CommentService', () => {
  let service: CommentService;

  const mockArticleRepository = {
    findOneBy: jest.fn(),
  };

  const mockUserRepository = {
    findOneByOrFail: jest.fn(),
  };

  const mockCommentRepository = {
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    remove: jest.fn(),
  };

  const slug = 'test-article';
  const commentData: CreateCommentReqDto = { body: 'Test comment' };
  const userId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: mockArticleRepository,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: mockCommentRepository,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  describe('create', () => {
    it('should create a comment successfully', async () => {
      mockArticleRepository.findOneBy.mockResolvedValue({
        id: 1,
      } as ArticleEntity);
      mockUserRepository.findOneByOrFail.mockResolvedValue({
        id: userId,
        toDto: jest.fn().mockReturnValue({ username: 'test-user' }),
      } as any);
      mockCommentRepository.save.mockResolvedValue({
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
      mockArticleRepository.findOneBy.mockResolvedValue(null);

      await expect(
        service.create('invalid-slug', { body: 'Test comment' }, userId),
      ).rejects.toThrow(ValidationException);
    });
  });

  describe('list', () => {
    it('should return a list of comments', async () => {
      mockArticleRepository.findOneBy.mockResolvedValue({
        id: 1,
      } as ArticleEntity);
      mockCommentRepository.find.mockResolvedValue([
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
      mockArticleRepository.findOneBy.mockResolvedValue(null);

      await expect(service.list('invalid-slug')).rejects.toThrow(
        ValidationException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a comment successfully', async () => {
      mockCommentRepository.findOneBy.mockResolvedValue({
        id: 1,
        authorId: userId,
      } as CommentEntity);
      mockCommentRepository.remove.mockResolvedValue(undefined);

      await expect(service.delete(1, userId)).resolves.toBeUndefined();
    });

    it('should throw ValidationException if comment does not exist', async () => {
      mockCommentRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete(1, userId)).rejects.toThrow(
        ValidationException,
      );
    });

    it('should throw ValidationException if user is not the author', async () => {
      mockCommentRepository.findOneBy.mockResolvedValue({
        id: 1,
        authorId: 2,
      } as CommentEntity);

      await expect(service.delete(1, userId)).rejects.toThrow(
        ValidationException,
      );
    });
  });
});
