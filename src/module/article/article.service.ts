import { Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import {
  CONFIG_REDIS_TOKEN,
  RedisConfig,
} from '../../common/config/app.config';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ArticleService {
  private readonly redisConfig: RedisConfig;

  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(ArticleEntity)
    private readonly repository: Repository<ArticleEntity>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    this.redisConfig = configService.get<RedisConfig>(CONFIG_REDIS_TOKEN);
  }

  async createArticle(data: ArticleCreateDto): Promise<void> {
    const author = await this.userService.getUserById(data.authorId);

    const article = this.repository.create({
      author: author,
      description: data.description,
      name: data.name,
    });

    await this.invalidationArticleCache();
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
    const cacheKey = `articles:${JSON.stringify(data)}`;
    const cached =
      await this.cacheManager.get<PaginatedResponse<ArticleEntity>>(cacheKey);
    if (cached) return cached;
    console.log(123);
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

    const response: PaginatedResponse<ArticleEntity> = {
      data: articles,
      totalDocs: pagination.totalElements,
      totalPage: pagination.totalPage,
    };

    await this.cacheManager.set<PaginatedResponse<ArticleEntity>>(
      cacheKey,
      response,
      this.redisConfig.ttl,
    );

    return response;
  }

  async deleteArticleById(id: string): Promise<void> {
    const article = await this.getArticleById(id);

    await this.invalidationArticleCache();
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

    await this.invalidationArticleCache();
    return await this.repository.save(article);
  }

  async invalidationArticleCache(): Promise<void> {
    await this.cacheManager.clear();
  }
}
