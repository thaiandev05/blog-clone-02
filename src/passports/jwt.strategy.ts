import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
// bao ve route
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET')! // Nên đặt trong biến môi trường
        })
    }

    async validate(payload: any) {
        // Here you can add additional validation logic if needed
        return { userId: payload.sub, email: payload.email };// padload.sub is the user id, payload.email is the email
    }
}