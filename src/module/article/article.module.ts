import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArticleEntity } from './article.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([ArticleEntity])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
