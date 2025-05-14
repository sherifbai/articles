import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { compare } from 'bcrypt';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CONFIG_ACCESS_TOKEN } from '../../common/config/app.config';
import { LoginDto } from './dto/login.dto';
import { JwtPayloadInterface } from './interfaces/jwt.payload.interface';

@Injectable()
export class AuthService {
  private accessTokenConfig: JwtModuleOptions;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    this.accessTokenConfig =
      this.configService.getOrThrow<JwtModuleOptions>(CONFIG_ACCESS_TOKEN);
  }

  async login(data: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userService.getUserByUsername(data.username);

    if (!user) {
      void this.userService.createUser({
        email: 'godness980@gmail.com',
        password: 'admin123',
        username: 'sherif',
        lastName: 'Rumzetov',
        firstName: 'Sherifbai',
      });

      throw new NotFoundException('User by this username does not exist');
    }

    const comparePassword = await compare(data.password, user.password);

    if (!comparePassword) {
      throw new UnauthorizedException('Passwords does not match');
    }

    const payload: JwtPayloadInterface = {
      id: user.id,
    };

    return this.getTokens(payload);
  }

  async getTokens(
    payload: JwtPayloadInterface,
  ): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.accessTokenConfig.secret,
      expiresIn: this.accessTokenConfig.signOptions?.expiresIn,
    });

    return {
      accessToken,
    };
  }
}
