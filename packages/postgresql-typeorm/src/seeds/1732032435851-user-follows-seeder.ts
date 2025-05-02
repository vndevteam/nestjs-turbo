import { getRandomInt } from '@repo/nest-common';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserEntity, UserFollowsEntity } from '../entities';

export class UserFollowsSeeder1732032435851 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    _factoryManager: SeederFactoryManager,
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

    const userFollowsRepository = dataSource.getRepository(UserFollowsEntity);
    for (const user of users) {
      const randomUserNumber = getRandomInt(0, users.length - 1);
      const randomFoloweeId = users[randomUserNumber].id;
      const followeeId =
        randomFoloweeId === user.id
          ? users[randomUserNumber + 1].id
          : randomFoloweeId;
      const isExist = await userFollowsRepository.existsBy({
        followerId: user.id,
        followeeId,
      });

      if (!isExist) {
        await userFollowsRepository.save({
          followerId: user.id,
          followeeId,
        });
      }
    }
  }
}
