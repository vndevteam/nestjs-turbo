import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { TagEntity } from '../entities';

export class TagSeeder1732028144623 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const tagFactory = factoryManager.get(TagEntity);
    await tagFactory.saveMany(10);
  }
}
