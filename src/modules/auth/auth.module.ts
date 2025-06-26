import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EmailService } from 'src/email/emails.service';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthCookieStrategy } from 'src/passports/cookie.strategy';
import { JwtStrategy } from 'src/passports/jwt.strategy';
import { LocalStrategy } from 'src/passports/local.strategy';
import { AuthController } from './auth.controller';
import { IsUniqueEmail } from './auth.dto';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { EmailModule } from 'src/email/emails.module';
import { GoogleStrategy } from 'src/passports/googleStrategy';
import googleConfig from 'src/config/google.config';
import { SocialService } from './social.service';

@Module({
  providers: [
    AuthService,
    IsUniqueEmail,
    LocalStrategy,
    JwtStrategy,
    TokenService,
    AuthCookieStrategy,
    ConfigService,
    GoogleStrategy,
    SocialService
  ],
  controllers: [AuthController],
  imports: [
    EmailModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,// secret key
      signOptions: {expiresIn: '3600s'}// time exprired
    })
  ],
  exports: [AuthService]
})
export class AuthModule {}
