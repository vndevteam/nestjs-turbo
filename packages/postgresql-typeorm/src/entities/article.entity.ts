import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
  UpdateDateColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { CommentEntity } from './comment.entity';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

@Entity('article')
export class ArticleEntity extends AbstractEntity {
  constructor(data?: Partial<ArticleEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_article_id' })
  id!: number;

  @Column()
  @Index('UQ_article_slug', ['slug'], { unique: true })
  slug!: string;

  @Column()
  title!: string;

  @Column({ default: '' })
  description!: string;

  @Column({ default: '' })
  body!: string;

  @Column({ name: 'author_id' })
  authorId: number;

  @ManyToOne(() => UserEntity, (user) => user.articles)
  @JoinColumn({
    name: 'author_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_article_user',
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

  @ManyToMany(() => TagEntity)
  @JoinTable({
    name: 'article_to_tag',
    joinColumn: {
      name: 'article_id',
      foreignKeyConstraintName: 'FK_article_to_tag_article',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id',
      foreignKeyConstraintName: 'FK_article_to_tag_tag',
      referencedColumnName: 'id',
    },
  })
  tags: Relation<TagEntity[]>;

  @OneToMany(() => CommentEntity, (comment) => comment.article)
  comments: Relation<CommentEntity[]>;

  @ManyToMany(() => UserEntity, (user) => user.favorites)
  favoritedBy: Relation<UserEntity[]>;
}
