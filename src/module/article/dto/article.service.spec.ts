import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { ArticleService } from '../article.service';
import { UserService } from '../../user/user.service';
import { ArticleEntity } from '../article.entity';
import { ArticleListDto } from './article.list.dto';
import { ArticleCreateDto } from './article.create.dto';
import { Repository } from 'typeorm';
import { ArticleUpdateDto } from './article.update.dto';

describe('ArticleService', () => {
  let service: ArticleService;
  let cacheManager: Cache;
  let repository: jest.Mocked<Repository<ArticleEntity>>;
  let userService: UserService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            clear: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(ArticleEntity),
          useValue: {
            findOne: jest.fn(),
            count: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue({ ttl: 100 }), // Simulate RedisConfig
          },
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
    cacheManager = module.get(CACHE_MANAGER);
    repository = module.get(getRepositoryToken(ArticleEntity));
    userService = module.get(UserService);
    configService = module.get(ConfigService);
  });

  it('should create and save a new article and clear cache', async () => {
    const authorId = crypto.randomUUID();
    const mockAuthor = { id: authorId };
    const dto: ArticleCreateDto = {
      authorId: authorId,
      name: 'Test Article',
      description: 'A description',
    };
    const mockArticle = {
      name: dto.name,
      description: dto.description,
      author: mockAuthor,
    };

    (userService.getUserById as jest.Mock).mockResolvedValue(mockAuthor);
    (repository.create as jest.Mock).mockReturnValue(mockArticle);

    await service.createArticle(dto);

    expect(userService.getUserById).toHaveBeenCalledWith(dto.authorId);
    expect(repository.create).toHaveBeenCalledWith(mockArticle);
    expect(cacheManager.clear).toHaveBeenCalled();
    expect(repository.save).toHaveBeenCalledWith(mockArticle);
  });

  it('should return articles from cache if exists', async () => {
    const dto: ArticleListDto = {
      page: 1,
      perPage: 10,
    };
    const mockResponse = {
      data: [],
      totalDocs: 0,
      totalPage: 0,
    };

    (cacheManager.get as jest.Mock).mockResolvedValue(mockResponse);

    const result = await service.getArticles(dto);

    expect(cacheManager.get).toHaveBeenCalledWith(
      `articles:${JSON.stringify(dto)}`,
    );
    expect(result).toEqual(mockResponse);
    expect(repository.find).not.toHaveBeenCalled();
  });

  it('should fetch and cache articles if not in cache', async () => {
    const dto: ArticleListDto = {
      page: 1,
      perPage: 10,
    };

    (cacheManager.get as jest.Mock).mockResolvedValue(undefined);
    repository.count.mockResolvedValue(0);
    repository.find.mockResolvedValue([]);

    const result = await service.getArticles(dto);

    expect(repository.count).toHaveBeenCalled();
    expect(repository.find).toHaveBeenCalled();
    expect(cacheManager.set).toHaveBeenCalledWith(
      `articles:${JSON.stringify(dto)}`,
      {
        data: [],
        totalDocs: 0,
        totalPage: 0,
      },
      100,
    );
    expect(result).toEqual({
      data: [],
      totalDocs: 0,
      totalPage: 0,
    });
  });

  it('should clear the cache when invalidating', async () => {
    await service.invalidationArticleCache();
    expect(cacheManager.clear).toHaveBeenCalled();
  });
});
