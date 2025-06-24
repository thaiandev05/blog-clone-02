import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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

@Module({
  providers: [
    AuthService,
    IsUniqueEmail,
    LocalStrategy,
    JwtStrategy,
    TokenService,
    AuthCookieStrategy,
    ConfigService,
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
