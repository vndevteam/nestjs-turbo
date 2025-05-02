import { setSeederFactory } from 'typeorm-extension';
import { UserEntity } from '../entities';

export default setSeederFactory(UserEntity, (fake) => {
  const user = new UserEntity();

  const firstName = fake.person.firstName();
  const lastName = fake.person.lastName();
  user.username = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
  user.email = fake.internet.email({ firstName, lastName });
  user.password = '12345678';
  user.bio = fake.lorem.sentence();
  user.image = fake.image.avatar();

  return user;
});
