import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('articles')
export class ArticleEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'varchar', length: 500 })
  description: string;

  @ManyToOne(() => UserEntity, (author) => author.articles)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
