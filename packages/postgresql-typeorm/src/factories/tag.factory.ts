import { setSeederFactory } from 'typeorm-extension';
import { TagEntity } from '../entities';

export default setSeederFactory(TagEntity, async (fake) => {
  const tag = new TagEntity();

  let uniqueName: string;
  do {
    uniqueName = fake.lorem.words({ min: 1, max: 4 });
  } while (await TagEntity.findOneBy({ name: uniqueName }));
  tag.name = uniqueName;

  return tag;
});
