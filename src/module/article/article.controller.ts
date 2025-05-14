import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ArticleCreateDto } from './dto/article.create.dto';
import { ArticleListDto } from './dto/article.list.dto';
import { ArticleEntity } from './article.entity';
import { ArticleUpdateDto } from './dto/article.update.dto';
import { AuthGuard } from '../auth/guard/auth.gurd';
import { PaginatedResponse } from '../../common/interfaces/paginated.response';

@ApiTags('Articles')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller({ path: 'articles', version: '1' })
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async createArticle(@Body() data: ArticleCreateDto): Promise<void> {
    return this.articleService.createArticle(data);
  }

  @Get()
  async getArticles(
    @Query() data: ArticleListDto,
  ): Promise<PaginatedResponse<ArticleEntity>> {
    return this.articleService.getArticles(data);
  }

  @Get(':id')
  async getArticleById(@Param('id') id: string): Promise<ArticleEntity> {
    return this.articleService.getArticleById(id);
  }

  @Put(':id')
  async updateArticleById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: ArticleUpdateDto,
  ): Promise<ArticleEntity> {
    return this.articleService.updateArticleById(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArticleById(@Param('id') id: string): Promise<void> {
    return this.articleService.deleteArticleById(id);
  }
}
