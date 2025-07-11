import { Body, Controller, Delete, Get, HttpException, HttpStatus, Patch, Post, Query, Req, Request, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { Users } from 'generated/prisma';
import { AuthCookieGuard } from 'src/guards/auth-cookie.guard';
import { GoogleGuard } from 'src/guards/google-auth.guard';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { AvailableUserDto, VerifiedEmail, VerifyingUserEmail } from './auth.dto';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService,
    private readonly tokenService: TokenService,
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

  @Post('refresh/token')
  async refreshToken(@Body() body: { user: Users ,refreshToken: string }) {
    return this.tokenService.verifyRefreshToken( body.user.id, body.refreshToken);
  }

  @UseGuards(AuthCookieGuard)
  @Delete('logout')
  async logout(@Request() req, @Res({ passthrough: true }) res: Response,session_id: string){
    return await this.authService.logout(req.user, res,session_id)
  }

  @Post('send/verifying/Email')
  async sendVerificationEmail(@Body()data: VerifyingUserEmail){
    return await this.authService.verifyingEmail(data)
  }

  @Get('verify/email/confirm')
  async verifiedEmail(@Query()data: VerifiedEmail){
    return await this.authService.verifiedEmail(data)
  }

  @Post('send/deleted/Email')
  async deletedEmail(@Body()data: VerifyingUserEmail){
    return await this.authService.deletingEmail(data)
  }

  @Get('deleted/email/confirm')
  async deletedAccount(@Query()data: VerifiedEmail){
    return await this.authService.deletedAccount(data)
  }

  @Post('reseted/password')
  async resetPassword(@Body()data: VerifyingUserEmail){
    return await this.authService.resetedPassword(data)
  }

  @Patch('undoDeleted/account')
  async undoDeletedAccount(@Body()data: AvailableUserDto){
    return await this.authService.undoDeleted(data)
  }

  @Get('getList')
  async getList(){
    return await this.authService.getListTest()
  }

  @Get('google/login')
  @UseGuards(GoogleGuard)
  handleLogin() {
    return { msg: 'Google Authentication' };
  }

  // api/auth/google/redirect
  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async handleRedirect(@Request() req, @Res({ passthrough: true }) res: Response) {
    try {
      if (!req.user) {
        throw new HttpException('No user data received from Google', HttpStatus.UNAUTHORIZED);
      }

      // Create session and tokens using OAuth login
      const result = await this.authService.oauthLogin(req.user, res);
      
      return result;
    } catch (error) {
      console.error('Google callback error:', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException('Google authentication failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('status')
  user(@Req() request: Request) {
    if (request.bodyUsed) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
