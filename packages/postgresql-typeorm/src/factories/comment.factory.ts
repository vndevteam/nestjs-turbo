import { setSeederFactory } from 'typeorm-extension';
import { CommentEntity } from '../entities';

export default setSeederFactory(CommentEntity, (fake) => {
  const comment = new CommentEntity();

  comment.body = fake.lorem.paragraphs(1);
  comment.articleId = 1;
  comment.authorId = 1;

  return comment;
});
