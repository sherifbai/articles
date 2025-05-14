import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ListQueryDto {
  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  page = 1;

  @ApiProperty({
    type: Number,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  perPage = 10;
}
