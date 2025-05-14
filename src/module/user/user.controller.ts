import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';
import { UserListDto } from './dto/user.list.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.gurd';
import { User } from '../../common/decorators/user.decorator';
import { JwtPayloadInterface } from '../auth/interfaces/jwt.payload.interface';
import { UserEntity } from './user.entity';

@ApiTags('User')
@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async userCreate(@Body() data: UserCreateDto): Promise<void> {
    return this.userService.createUser(data);
  }

  @Get('profile')
  async getUser(@User() user: JwtPayloadInterface): Promise<UserEntity> {
    return this.userService.getUserById(user.id);
  }

  @Get()
  async getUsers(@Query() data: UserListDto) {
    return this.userService.getUsers(data);
  }
}
