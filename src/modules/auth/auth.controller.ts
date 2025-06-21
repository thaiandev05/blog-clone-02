import { Body, Controller, Delete, Get, Post, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Users } from 'generated/prisma';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AvailableUserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { Response } from 'express'
import { AuthCookieGuard } from 'src/guards/auth-cookie.guard';
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService
  ){}

  @Post('register')
  async register(@Body() req){
    return this.authService.register(req)
  }

  @UseGuards(LocalAuthGuard)// validatior user
  @Get('login')
  async login(@Body() data: AvailableUserDto,@Res({ passthrough: true})res: Response){
    return this.authService.login(data,res)
  }
  // using bear token
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Request() req){
    return req.user;
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { user: Users ,refreshToken: string }) {
    return this.tokenService.verifyRefreshToken( body.user.id, body.refreshToken);
  }

  @UseGuards(AuthCookieGuard)
  @Delete('logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response,session_id: string){
    return await this.authService.logout(req.user, res,session_id)
  }

}
