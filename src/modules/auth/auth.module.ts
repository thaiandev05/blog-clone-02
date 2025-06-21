import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/passports/jwt.strategy';
import { LocalStrategy } from 'src/passports/local.strategy';
import { UsersModule } from 'src/modules/users/users.module';
import { AuthController } from './auth.controller';
import { IsUniqueEmail } from './auth.dto';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { AuthCookieStrategy } from 'src/passports/cookie.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [AuthService,IsUniqueEmail,LocalStrategy,JwtStrategy,TokenService,AuthCookieStrategy,ConfigService],
  controllers: [AuthController],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,// secret key
      signOptions: {expiresIn: '3600s'}// time exprired
    })
  ]
})
export class AuthModule {}
