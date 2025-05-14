import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtModuleOptions, JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { CONFIG_ACCESS_TOKEN } from '../../../common/config/app.config';

@Injectable()
export class AuthGuard implements CanActivate {
  private accessTokenConfig: JwtModuleOptions =
    this.configService.getOrThrow<JwtModuleOptions>(CONFIG_ACCESS_TOKEN);

  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: this.accessTokenConfig.secret || 'secret',
      });
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
