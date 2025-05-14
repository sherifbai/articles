import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CONFIG_ACCESS_TOKEN } from '../../../common/config/app.config';
import { JwtPayloadInterface } from '../interfaces/jwt.payload.interface';
import { JwtModuleOptions } from '@nestjs/jwt';

const ACCESS_TOKEN = 'access_token';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN,
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey:
        configService.get<JwtModuleOptions>(CONFIG_ACCESS_TOKEN).secret ||
        'secret',
    });
  }

  async validate(payload: JwtPayloadInterface) {
    return payload;
  }
}
