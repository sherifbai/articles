import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  Repository,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import { ArticleEntity } from './article.entity';
import { ArticleCreateDto } from './dto/article.create.dto';
import { UserService } from '../user/user.service';
import { ArticleListDto } from './dto/article.list.dto';
import { createPagination } from '../../common/helpers/pagination.helper';
import { ArticleUpdateDto } from './dto/article.update.dto';
import { PaginatedResponse } from '../../common/interfaces/paginated.response';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repository: Repository<ArticleEntity>,
    private readonly userService: UserService,
  ) {}

  async createArticle(data: ArticleCreateDto): Promise<void> {
    const author = await this.userService.getUserById(data.authorId);

    const article = this.repository.create({
      author: author,
      description: data.description,
      name: data.name,
    });

    await this.repository.save(article);
  }

  async getArticleById(id): Promise<ArticleEntity> {
    const article = await this.repository.findOne({ where: { id } });

    if (!article) {
      throw new NotFoundException('Article not found');
    }

    return article;
  }

  async getArticles(
    data: ArticleListDto,
  ): Promise<PaginatedResponse<ArticleEntity>> {
    let where: FindOptionsWhere<ArticleEntity> = {};

    if (data.authorId) {
      const author = await this.userService.getUserById(data.authorId);

      where = {
        ...where,
        author: { id: author.id },
      };
    }

    if (data.from) {
      where = {
        ...where,
        createdAt: MoreThanOrEqual(data.from),
      };
    }

    if (data.to) {
      where = {
        ...where,
        createdAt: LessThanOrEqual(data.from),
      };
    }

    const count = await this.repository.count({ where });
    const pagination = createPagination({
      count: count,
      page: data.page,
      perPage: data.perPage,
    });

    const articles = await this.repository.find({
      where: where,
      skip: pagination.skip,
      take: pagination.take,
    });

    return {
      data: articles,
      totalDocs: pagination.totalElements,
      totalPage: pagination.totalPage,
    };
  }

  async deleteArticleById(id: string): Promise<void> {
    const article = await this.getArticleById(id);

    await this.repository.delete({ id: article.id });
  }

  async updateArticleById(
    id: string,
    data: ArticleUpdateDto,
  ): Promise<ArticleEntity> {
    const article = await this.getArticleById(id);

    if (data.authorId) {
      article.author = await this.userService.getUserById(data.authorId);
    }

    article.name = data.name;
    article.description = data.description;

    return await this.repository.save(article);
  }
}
