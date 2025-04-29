import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagEntity } from '@repo/mysql-typeorm';
import { Repository } from 'typeorm';
import { TagService } from './tag.service';

describe('TagService', () => {
  let service: TagService;
  let tagRepositoryValue: Partial<
    Record<keyof Repository<TagEntity>, jest.Mock>
  >;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: getRepositoryToken(TagEntity),
          useValue: tagRepositoryValue,
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
