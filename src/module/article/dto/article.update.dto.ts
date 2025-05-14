import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class ArticleUpdateDto {
  @ApiProperty({
    type: String,
    example: '2016c11e-f1e8-4684-a7f3-bef32bf4798d',
    required: false,
  })
  @IsOptional()
  @IsUUID()
  authorId?: string;

  @ApiProperty({ type: String, example: 'NestJS', required: false })
  @IsOptional()
  @Length(1, 50)
  @IsString()
  name?: string;

  @ApiProperty({
    type: String,
    example:
      'Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (yet still enables developers to code in pure JavaScript) and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).',
    required: false,
  })
  @IsOptional()
  @Length(0, 500)
  @IsString()
  description: string;
}
