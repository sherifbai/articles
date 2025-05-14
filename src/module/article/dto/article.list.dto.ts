import { ListQueryDto } from '../../../common/dto/list.query.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional, IsUUID } from 'class-validator';

export class ArticleListDto extends ListQueryDto {
  @ApiProperty({
    required: false,
    example: '2016c11e-f1e8-4684-a7f3-bef32bf4798d',
  })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  from?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDate()
  to?: Date;
}
