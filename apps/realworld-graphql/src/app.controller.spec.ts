import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppResolver;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppResolver],
      providers: [AppService],
    }).compile();

    appController = app.get<AppResolver>(AppResolver);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
