import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

@Entity('tag')
export class TagEntity extends AbstractEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_tag_id' })
  id!: number;

  @Column()
  @Index('UQ_tag_name', ['name'], { unique: true })
  name!: string;
}
