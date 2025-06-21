import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieParseOptions } from 'cookie-parser';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { Prisma, Session, Users } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/modules/users/users.service';
import { AvailableUserDto, RegisterUserDto } from './auth.dto';
import { TokenService } from './token.service';
const argon2 = require('argon2');

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name)
  
  constructor(
    private readonly userService: UsersService,
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService,
    private readonly config: ConfigService
  ) { }

  // validator user
  async validateUser(email: string, pass: string) {
    const user = await this.prisma.users.findFirst({
      where: { email: email },
      omit: {
        password: false
      }
    })

    if (!user) {
      throw new NotFoundException("user not found");
    }

    const isMatch = await argon2.verify(user.password, pass)

    if (!isMatch) {
      throw new UnauthorizedException("Password is not matched")
    }

    return user
  }

  async register(userData: RegisterUserDto) {
    await this.prisma.users.create({
      data: {
        email: userData.email,
        password: await argon2.hash(userData.password),
        name: userData.name,
      }
    })
    return {
      message: 'Register successfully',
      data: userData
    }
  }

  async login(data: AvailableUserDto,res: Response) {
    const user = await this.validateUser(data.email, data.password)
    // create session
    await this.createSession(user,res)

    const {password, ...userWithoutPassword} = user

    return{
      message: 'Login successfully',
      data: userWithoutPassword,
      '@timestamp': new Date().toISOString()
    }

  }

  async getProfile(email: string) {
    const user = await this.userService.findEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createSession(user: Users, res: Response) {
    // generate token
    const tokens = await this.tokenService.generateRefreshToken(user.id, user.email)

    // check available session
    const sessionId = res.req.cookies?.session_id

    let session: Session
    if (sessionId) {
      const exitedSession = await this.prisma.session.findUnique({ where: {id: sessionId}})
      if(exitedSession) {
        session = exitedSession
      }else{
        const newSessionId = randomUUID()
        session = await this.prisma.session.create({ data: { id: newSessionId, userId: user.id, token: tokens.refreshToken, expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) }})
      }
    } else {
      const newSessionId = randomUUID()
      session = await this.prisma.session.create({ data: { id: newSessionId, userId: user.id, token: tokens.refreshToken, expiresAt: new Date(Date.now() + 10 * 365 * 24 * 60 * 60 * 1000) }})
    } 
    
    res.cookie('session_id', session.id, {
      maxAge: 10 * 365 * 24 * 60 * 60 * 1000,// 10 years
    })

    await this.tokenService.saveRefreshToken(user.id, tokens.refreshToken, session.id)

    const cookieOptions = this.config.getOrThrow<CookieParseOptions>('cookie')
    res
      .cookie('refresh_token', tokens.refreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 1000, // 1h in milliseconds
      })
      .cookie('access_token', tokens.accessToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      })

    return { tokens, session }
  }
  // optional thi de cuoi
  async logout(user: Users, res: Response, sessionId?: string){

    res.clearCookie('refresh_token').clearCookie('access_token')

  await this.prisma.session.update({
      where: { id: sessionId, userId: user.id },
      data: { token: null } // Set token to empty string instead of null to satisfy type
    }).catch(err => {
      if(err.code === 'P2025' ||
        err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
          this.logger.warn(`User \`${user.id}\` don't have session id during logout`)
        }
    })

    return{
      message: 'Logout successfully',
      '@timestamp': new Date().toISOString(),
    }
  }

}