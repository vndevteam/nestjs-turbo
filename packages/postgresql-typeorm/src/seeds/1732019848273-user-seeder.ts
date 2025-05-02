import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { UserEntity } from '../entities';

export class UserSeeder1732019848273 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);
    const userFactory = factoryManager.get(UserEntity);

    const adminUser = await repository.findOneBy({ username: 'admin' });
    if (!adminUser) {
      const user = await userFactory.make({
        username: 'admin',
        email: 'admin@example.com',
      });
      await repository.insert(user);
    }

    await userFactory.saveMany(10);
  }
}
