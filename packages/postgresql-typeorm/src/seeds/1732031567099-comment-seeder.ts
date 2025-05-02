import { getRandomInt } from '@repo/nest-common';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { ArticleEntity, CommentEntity, UserEntity } from '../entities';

export class CommentSeeder1732031567099 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    // Get random users
    const userRepository = dataSource.getRepository(UserEntity);
    const numberOfUsers = await userRepository.count();
    const randomOffset = getRandomInt(0, numberOfUsers - 1);

    const users = await userRepository
      .createQueryBuilder('user')
      .skip(randomOffset)
      .take(10)
      .getMany();

    // Get random articles
    const articleRepository = dataSource.getRepository(ArticleEntity);
    const numberOfArticles = await articleRepository.count();
    const randomArticleOffset = getRandomInt(0, numberOfArticles - 1);

    const articles = await articleRepository
      .createQueryBuilder('article')
      .skip(randomArticleOffset)
      .take(10)
      .getMany();

    const commentFactory = factoryManager.get(CommentEntity);
    for (const user of users) {
      const randomArticleNumber = getRandomInt(0, articles.length - 1);
      await commentFactory.saveMany(5, {
        authorId: user.id,
        articleId: articles[randomArticleNumber].id,
      });
    }
  }
}
