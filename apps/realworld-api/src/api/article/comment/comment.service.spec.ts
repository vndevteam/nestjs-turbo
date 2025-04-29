import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ArticleEntity, CommentEntity, UserEntity } from '@repo/mysql-typeorm';
import { Repository } from 'typeorm';
import { CommentService } from './comment.service';

describe('CommentService', () => {
  let service: CommentService;
  let articleRepositoryValue: Partial<
    Record<keyof Repository<ArticleEntity>, jest.Mock>
  >;
  let userRepositoryValue: Partial<
    Record<keyof Repository<UserEntity>, jest.Mock>
  >;
  let commentRepositoryValue: Partial<
    Record<keyof Repository<CommentEntity>, jest.Mock>
  >;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: articleRepositoryValue,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: userRepositoryValue,
        },
        {
          provide: getRepositoryToken(CommentEntity),
          useValue: commentRepositoryValue,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
