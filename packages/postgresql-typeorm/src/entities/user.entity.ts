import { hashPassword as hashPass } from '@repo/nest-common';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { ArticleEntity } from './article.entity';
import { CommentEntity } from './comment.entity';
import { UserFollowsEntity } from './user-follows.entity';

@Entity('user')
export class UserEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_user_id' })
  id!: number;

  @Column()
  @Index('UQ_user_username', ['username'], { unique: true })
  username!: string;

  @Column()
  @Index('UQ_user_email', ['email'], { unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: '' })
  image!: string;

  @Column({ default: '' })
  bio!: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hashPass(this.password);
    }
  }

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: Relation<ArticleEntity[]>;

  @OneToMany(() => CommentEntity, (comment) => comment.author)
  comments: Relation<CommentEntity[]>;

  @ManyToMany(() => ArticleEntity, (article) => article.favoritedBy)
  @JoinTable({
    name: 'user_favorites',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_user_favorites_user',
    },
    inverseJoinColumn: {
      name: 'article_id',
      referencedColumnName: 'id',
      foreignKeyConstraintName: 'FK_user_favorites_article',
    },
  })
  favorites: Relation<ArticleEntity[]>;

  @OneToMany(() => UserFollowsEntity, (userFollow) => userFollow.follower)
  following: Relation<UserFollowsEntity[]>;

  @OneToMany(() => UserFollowsEntity, (userFollow) => userFollow.followee)
  followers: Relation<UserFollowsEntity[]>;
}
