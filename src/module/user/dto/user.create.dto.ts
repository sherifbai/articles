import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 50)
  @ApiProperty({ type: String, example: 'sherif' })
  username: string;

  @ApiProperty({ type: String, example: 'Sherifbai' })
  @Length(1, 50)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ type: String, example: 'Ruzmetov' })
  @Length(1, 50)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ type: String, example: 'godness980@gmail.com' })
  @Length(10, 50)
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, example: 'admin123' })
  @Length(5, 10)
  @IsString()
  @IsNotEmpty()
  password: string;
}
