import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ArticleEntity } from './article.entity';
import { UserEntity } from './user.entity';

@Entity('comment')
export class CommentEntity extends AbstractEntity {
  constructor(data?: Partial<CommentEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_comment_id' })
  id!: number;

  @Column()
  body!: string;

  @Column({ name: 'article_id' })
  articleId!: number;

  @ManyToOne(() => ArticleEntity, (article) => article.comments)
  @JoinColumn({
    name: 'article_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_comment_article',
  })
  article: ArticleEntity;

  @Column({ name: 'author_id' })
  authorId!: number;

  @ManyToOne(() => UserEntity, (user) => user.comments)
  @JoinColumn({
    name: 'author_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_comment_user',
  })
  author: UserEntity;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: false,
  })
  updatedAt: Date;
}
