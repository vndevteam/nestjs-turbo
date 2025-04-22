import { validateDto } from '@/utils/unit-test.util';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';
import { ArticleFeedReqDto } from './dto/article-feed.dto';
import { ArticleListReqDto, ArticleListResDto } from './dto/article-list.dto';
import { ArticleResDto } from './dto/article.dto';
import { CreateArticleReqDto } from './dto/create-article.dto';
import { UpdateArticleReqDto } from './dto/update-article.dto';

describe('ArticleController', () => {
  let controller: ArticleController;
  let articleService: Partial<Record<keyof ArticleService, jest.Mock>>;

  beforeAll(async () => {
    articleService = {
      list: jest.fn(),
      getFeed: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticleController],
      providers: [
        {
          provide: ArticleService,
          useValue: articleService,
        },
      ],
    }).compile();

    controller = module.get<ArticleController>(ArticleController);
  });

  describe('list', () => {
    it('should return a list of articles', async () => {
      const userId = 1;
      const reqDto: ArticleListReqDto = {
        tag: 'nestjs',
        author: 'testuser',
        favorited: 'testuser',
        limit: 10,
        offset: 0,
      };
      const mockArticles: ArticleListResDto = {
        articles: [
          {
            slug: 'test-article',
            title: 'Test Article',
            description: 'Test Description',
            body: 'Test Body',
            tagList: ['nestjs', 'testing'],
            createdAt: new Date(),
            updatedAt: new Date(),
            favorited: false,
            favoritesCount: 0,
            author: {
              username: 'testuser',
              bio: 'test bio',
              image: 'http://example.com/image.jpg',
              following: false,
            },
          },
        ],
        articlesCount: 1,
        pagination: {
          limit: 10,
          offset: 0,
          totalPages: 1,
          totalRecords: 1,
        },
      };

      articleService.list.mockResolvedValue(mockArticles);

      const result = await controller.list(userId, reqDto);

      expect(result).toEqual(mockArticles);
      expect(articleService.list).toHaveBeenCalled();
    });

    it('should throw an error if list fails', async () => {
      const reqDto: ArticleListReqDto = {
        tag: 'nestjs',
        author: 'testuser',
        favorited: 'testuser',
        limit: 10,
        offset: 0,
      };

      articleService.list.mockRejectedValue(new Error('List failed'));

      await expect(controller.list(1, reqDto)).rejects.toThrow('List failed');
      expect(articleService.list).toHaveBeenCalled();
    });

    describe('ArticleListReqDto', () => {
      it('should validate successfully with valid data', async () => {
        const validData = {
          tag: 'nestjs',
          author: 'testuser',
          favorited: 'testuser',
          limit: 10,
          offset: 0,
        };

        const dto = plainToInstance(ArticleListReqDto, validData);
        const errors = await validateDto(dto);

        expect(errors.length).toBe(0);
      });

      it('should fail validation if limit is negative', async () => {
        const invalidData: ArticleListReqDto = {
          tag: 'nestjs',
          author: 'testuser',
          favorited: 'testuser',
          limit: -10,
          offset: 0,
        };

        const dto = plainToInstance(ArticleListReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('limit');
      });

      it('should fail validation if offset is negative', async () => {
        const invalidData = {
          tag: 'nestjs',
          author: 'testuser',
          favorited: 'testuser',
          limit: 10,
          offset: -1,
        };

        const dto = plainToInstance(ArticleListReqDto, invalidData);
        const errors = await validate(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('offset');
      });
    });
  });

  describe('getFeed', () => {
    it('should return a feed of articles', async () => {
      const userId = 1;
      const reqDto: ArticleFeedReqDto = {
        limit: 10,
        offset: 0,
      };
      const mockArticles: ArticleListResDto = {
        articles: [
          {
            slug: 'test-article',
            title: 'Test Article',
            description: 'Test Description',
            body: 'Test Body',
            tagList: ['nestjs', 'testing'],
            createdAt: new Date(),
            updatedAt: new Date(),
            favorited: false,
            favoritesCount: 0,
            author: {
              username: 'testuser',
              bio: 'test bio',
              image: 'http://example.com/image.jpg',
              following: false,
            },
          },
        ],
        articlesCount: 1,
        pagination: {
          limit: 10,
          offset: 0,
          totalPages: 1,
          totalRecords: 1,
        },
      };

      articleService.getFeed.mockResolvedValue(mockArticles);

      const result = await controller.getFeed(userId, reqDto);

      expect(result).toEqual(mockArticles);
      expect(articleService.getFeed).toHaveBeenCalledWith(userId, reqDto);
    });

    it('should throw an error if getFeed fails', async () => {
      const userId = 1;
      const reqDto: ArticleFeedReqDto = {
        limit: 10,
        offset: 0,
      };

      articleService.getFeed.mockRejectedValue(new Error('Feed failed'));

      await expect(controller.getFeed(userId, reqDto)).rejects.toThrow(
        'Feed failed',
      );
      expect(articleService.getFeed).toHaveBeenCalledWith(userId, reqDto);
    });

    describe('ArticleFeedReqDto', () => {
      it('should validate successfully with valid data', async () => {
        const validData = {
          limit: 10,
          offset: 0,
        };

        const dto = plainToInstance(ArticleFeedReqDto, validData);
        const errors = await validateDto(dto);

        expect(errors.length).toBe(0);
      });

      it('should fail validation if limit is negative', async () => {
        const invalidData = {
          limit: -10,
          offset: 0,
        };

        const dto = plainToInstance(ArticleFeedReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('limit');
      });

      it('should fail validation if offset is negative', async () => {
        const invalidData = {
          limit: 10,
          offset: -1,
        };

        const dto = plainToInstance(ArticleFeedReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('offset');
      });
    });
  });

  describe('get', () => {
    it('should return an article', async () => {
      const userId = 1;
      const slug = 'test-article';
      const mockArticle: ArticleResDto = {
        article: {
          slug: 'test-article',
          title: 'Test Article',
          description: 'Test Description',
          body: 'Test Body',
          tagList: ['nestjs', 'testing'],
          createdAt: new Date(),
          updatedAt: new Date(),
          favorited: false,
          favoritesCount: 0,
        },
      };

      articleService.get.mockResolvedValue(mockArticle);

      const result = await controller.get(userId, slug);

      expect(result).toEqual(mockArticle);
      expect(articleService.get).toHaveBeenCalledWith(userId, slug);
    });

    it('should throw an error if get fails', async () => {
      const userId = 1;
      const slug = 'test-article';

      articleService.get.mockRejectedValue(new Error('Get failed'));

      await expect(controller.get(userId, slug)).rejects.toThrow('Get failed');
      expect(articleService.get).toHaveBeenCalledWith(userId, slug);
    });
  });

  describe('create', () => {
    it('should create a new article and return the article data', async () => {
      const userId = 1;
      const articleData: CreateArticleReqDto = {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['nestjs', 'testing'],
      };
      const mockArticle: ArticleResDto = {
        article: {
          slug: 'test-article',
          title: 'Test Article',
          description: 'Test Description',
          body: 'Test Body',
          tagList: ['nestjs', 'testing'],
          createdAt: new Date(),
          updatedAt: new Date(),
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'testuser',
            bio: 'test bio',
            image: 'http://example.com/image.jpg',
            following: false,
          },
        },
      };

      articleService.create.mockResolvedValue(mockArticle);

      const result = await controller.create(userId, articleData);

      expect(result).toEqual(mockArticle);
      expect(articleService.create).toHaveBeenCalledWith(userId, articleData);
    });

    it('should throw an error if create fails', async () => {
      const userId = 1;
      const articleData: CreateArticleReqDto = {
        title: 'Test Article',
        description: 'Test Description',
        body: 'Test Body',
        tagList: ['nestjs', 'testing'],
      };

      articleService.create.mockRejectedValue(new Error('Create failed'));

      await expect(controller.create(userId, articleData)).rejects.toThrow(
        'Create failed',
      );
      expect(articleService.create).toHaveBeenCalledWith(userId, articleData);
    });

    describe('CreateArticleReqDto', () => {
      it('should validate successfully with valid data', async () => {
        const validData = {
          title: 'Test Article',
          description: 'Test Description',
          body: 'Test Body',
          tagList: ['nestjs', 'testing'],
        };

        const dto = plainToInstance(CreateArticleReqDto, validData);
        const errors = await validateDto(dto);

        expect(errors.length).toBe(0);
      });

      it('should fail validation if title is empty', async () => {
        const invalidData = {
          title: '',
          description: 'Test Description',
          body: 'Test Body',
          tagList: ['nestjs', 'testing'],
        };

        const dto = plainToInstance(CreateArticleReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('title');
      });

      it('should fail validation if description is empty', async () => {
        const invalidData = {
          title: 'Test Article',
          description: '',
          body: 'Test Body',
          tagList: ['nestjs', 'testing'],
        };

        const dto = plainToInstance(CreateArticleReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('description');
      });

      it('should fail validation if body is empty', async () => {
        const invalidData = {
          title: 'Test Article',
          description: 'Test Description',
          body: '',
          tagList: ['nestjs', 'testing'],
        };

        const dto = plainToInstance(CreateArticleReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('body');
      });

      it('should fail validation if tagList element is empty', async () => {
        const invalidData = {
          title: 'Test Article',
          description: 'Test Description',
          body: 'Test Body',
          tagList: [''],
        };

        const dto = plainToInstance(CreateArticleReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('tagList');
      });
    });
  });

  describe('update', () => {
    it('should update an article and return the updated article data', async () => {
      const slug = 'test-article';
      const articleData: UpdateArticleReqDto = {
        title: 'Updated Test Article',
        description: 'Updated Test Description',
        body: 'Updated Test Body',
        tagList: ['nestjs', 'testing'],
      };
      const mockArticle: ArticleResDto = {
        article: {
          slug: 'test-article',
          title: 'Updated Test Article',
          description: 'Updated Test Description',
          body: 'Updated Test Body',
          tagList: ['nestjs', 'testing'],
          createdAt: new Date(),
          updatedAt: new Date(),
          favorited: false,
          favoritesCount: 0,
          author: {
            username: 'testuser',
            bio: 'test bio',
            image: 'http://example.com/image.jpg',
            following: false,
          },
        },
      };

      articleService.update.mockResolvedValue(mockArticle);

      const result = await controller.update(1, slug, articleData);

      expect(result).toEqual(mockArticle);
      expect(articleService.update).toHaveBeenCalledWith(1, slug, articleData);
    });

    it('should throw an error if update fails', async () => {
      const slug = 'test-article';
      const articleData: UpdateArticleReqDto = {
        title: 'Updated Test Article',
        description: 'Updated Test Description',
        body: 'Updated Test Body',
        tagList: ['nestjs', 'testing'],
      };

      articleService.update.mockRejectedValue(new Error('Update failed'));

      await expect(controller.update(1, slug, articleData)).rejects.toThrow(
        'Update failed',
      );
      expect(articleService.update).toHaveBeenCalledWith(1, slug, articleData);
    });

    describe('UpdateArticleReqDto', () => {
      it('should validate successfully with valid data', async () => {
        const validData = {
          title: 'Updated Test Article',
          description: 'Updated Test Description',
          body: 'Updated Test Body',
          tagList: ['nestjs', 'testing'],
        };

        const dto = plainToInstance(UpdateArticleReqDto, validData);
        const errors = await validateDto(dto);

        expect(errors.length).toBe(0);
      });

      it('should fail validation if title is empty', async () => {
        const invalidData = {
          title: '',
          description: 'Updated Test Description',
          body: 'Updated Test Body',
          tagList: ['nestjs', 'testing'],
        };

        const dto = plainToInstance(UpdateArticleReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('title');
      });

      it('should fail validation if description is empty', async () => {
        const invalidData = {
          title: 'Updated Test Article',
          description: '',
          body: 'Updated Test Body',
          tagList: ['nestjs', 'testing'],
        };

        const dto = plainToInstance(UpdateArticleReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('description');
      });

      it('should fail validation if body is empty', async () => {
        const invalidData = {
          title: 'Updated Test Article',
          description: 'Updated Test Description',
          body: '',
          tagList: ['nestjs', 'testing'],
        };

        const dto = plainToInstance(UpdateArticleReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('body');
      });

      it('should fail validation if tagList element is empty', async () => {
        const invalidData = {
          title: 'Updated Test Article',
          description: 'Updated Test Description',
          body: 'Updated Test Body',
          tagList: [''],
        };

        const dto = plainToInstance(UpdateArticleReqDto, invalidData);
        const errors = await validateDto(dto);

        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].property).toBe('tagList');
      });
    });
  });

  describe('delete', () => {
    it('should delete an article and return success', async () => {
      const slug = 'test-article';
      articleService.delete.mockResolvedValue({ success: true });

      const result = await controller.delete(slug);

      expect(result).toEqual({ success: true });
      expect(articleService.delete).toHaveBeenCalledWith(slug);
    });

    it('should throw an error if delete fails', async () => {
      const slug = 'test-article';
      articleService.delete.mockRejectedValue(new Error('Delete failed'));

      await expect(controller.delete(slug)).rejects.toThrow('Delete failed');
      expect(articleService.delete).toHaveBeenCalledWith(slug);
    });
  });
});
