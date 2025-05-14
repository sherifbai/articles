import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ type: String, example: 'sherif' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ type: String, example: 'admin123' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
