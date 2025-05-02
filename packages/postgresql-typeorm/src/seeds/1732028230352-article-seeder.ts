import { getRandomInt } from '@repo/nest-common';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { ArticleEntity, TagEntity, UserEntity } from '../entities';

export class ArticleSeeder1732028230352 implements Seeder {
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

    // Get random tags
    const tagRepository = dataSource.getRepository(TagEntity);
    const numberOfTags = await tagRepository.count();
    const randomTagOffset = getRandomInt(0, numberOfTags - 1);

    const tags = await tagRepository
      .createQueryBuilder('tag')
      .skip(randomTagOffset)
      .take(10)
      .getMany();

    const articleFactory = factoryManager.get(ArticleEntity);
    for (const user of users) {
      const randomTagNumber = getRandomInt(0, tags.length - 1);
      await articleFactory.saveMany(5, {
        authorId: user.id,
        tags: tags.slice(0, randomTagNumber).slice(0, 5),
      });
    }
  }
}
