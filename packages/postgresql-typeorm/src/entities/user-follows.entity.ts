import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { UserEntity } from './user.entity';

@Entity('user_follows')
@Index(
  'UQ_user_follows_follower_id_followee_id',
  ['followerId', 'followeeId'],
  {
    unique: true,
  },
)
export class UserFollowsEntity extends AbstractEntity {
  constructor(data?: Partial<UserFollowsEntity>) {
    super();
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_user_follows_id' })
  id: number;

  @Column({ name: 'follower_id' })
  @Index('UQ_user_follows_follower_id', ['followerId'])
  followerId: number;

  @Column({ name: 'followee_id' })
  @Index('UQ_user_follows_followee_id', ['followeeId'])
  followeeId: number;

  @ManyToOne(() => UserEntity, (user) => user.following)
  @JoinColumn({
    name: 'follower_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_user_follows_follower_id',
  })
  follower: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.followers)
  @JoinColumn({
    name: 'followee_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_user_follows_followee_id',
  })
  followee: UserEntity;
}
