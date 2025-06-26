import { Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { GoogleUser } from "src/modules/auth/auth.dto";
import { SocialService } from "src/modules/auth/social.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  private logger = new Logger(GoogleStrategy.name)
  constructor(
    private readonly socialService: SocialService
  ){
    super({
      clientID: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
      callbackURL: process.env.GOOGLE_OAUTH_CALLBACK_URL,
      scope: ['profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: GoogleUser) {
    // Bạn có thể xử lý thêm ở đây, ví dụ lưu user vào DB
    console.log(accessToken)

    console.log(refreshToken)

    console.log(profile)
    
    const user = this.socialService.validateGoogleUser(profile)
    return user || null
  }
}