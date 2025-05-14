import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ArticleEntity } from '../article/article.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 50, name: 'first_name' })
  firstName: string;

  @Column({ type: 'varchar', length: 50, name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', unique: true, length: 50 })
  email: string;

  @OneToMany(() => ArticleEntity, (article) => article.author)
  articles: ArticleEntity[];

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
