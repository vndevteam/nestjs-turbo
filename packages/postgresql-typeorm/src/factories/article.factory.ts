import { setSeederFactory } from 'typeorm-extension';
import { ArticleEntity } from '../entities';

export default setSeederFactory(ArticleEntity, (fake) => {
  const article = new ArticleEntity();

  article.title = fake.lorem.sentence();
  article.slug = fake.lorem.slug();
  article.description = fake.lorem.sentence();
  article.body = fake.lorem.paragraphs(10);
  article.authorId = 1;

  return article;
});
