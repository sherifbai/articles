import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';
import { UserListDto } from './dto/user.list.dto';

@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async userCreate(@Body() data: UserCreateDto): Promise<void> {
    return this.userService.createUser(data);
  }

  @Get()
  async getUsers(@Query() data: UserListDto) {
    return this.userService.getUsers(data);
  }
}
