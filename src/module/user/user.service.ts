import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { hash } from 'bcrypt';
import { UserListDto } from './dto/user.list.dto';
import { createPagination } from '../../common/helpers/pagination.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async createUser(data: UserCreateDto): Promise<void> {
    await this.checkEmail(data.email);

    const salt = parseInt(process.env.SALT || '10');
    const hashPassword = await hash(data.password, salt);

    const userEntity: UserEntity = {
      ...data,
      id: crypto.randomUUID(),
      password: hashPassword,
    };

    await this.repository.save(userEntity);
  }

  async getUserById(id: string): Promise<UserEntity> {
    const user = await this.repository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUsers(data: UserListDto) {
    const count = await this.repository.count();
    const pagination = createPagination({
      count,
      page: data.page,
      perPage: data.perPage,
    });

    const users = await this.repository.find({
      skip: pagination.skip,
      take: pagination.take,
    });

    return {
      data: users.map((user) => {
        const { password, ...userData } = user;

        return userData;
      }),
      totalPage: pagination.totalPage,
      totalDocs: count,
    };
  }

  async checkEmail(email: string): Promise<void> {
    const count = await this.repository.count({ where: { email } });

    if (count > 0) {
      throw new BadRequestException('Email already exist');
    }
  }
}
