import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { UsersService } from "src/modules/users/users.service";
@Injectable()
export class AuthCookieStrategy extends PassportStrategy(Strategy, 'auth-cookie') {
    constructor(
        private jwtService: JwtService,
        private config: ConfigService,
        private userService: UsersService
    ) {
        super()
    }

    async validate(req: Request): Promise<any> {
      const accessToken = req.cookies?.access_token
  
      if (!accessToken) {
        throw new UnauthorizedException('Access token not found')
      }
  
      try {
        const payload = this.jwtService.verify(accessToken, {
          secret: this.config.getOrThrow<string>('jwt.secret'),
        })
  
        const user = await this.userService.findById(payload.sub)
  
        if (!user) {
          throw new UnauthorizedException('User not found')
        }
  
        return user
      } catch (error) {
        throw new UnauthorizedException('Invalid or expired access token')
      }
    }
}

