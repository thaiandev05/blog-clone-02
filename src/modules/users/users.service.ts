import { BadRequestException, Body, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './users.dto';
const argon2 = require('argon2');
@Injectable()
export class UsersService {
  // muon su dung validator phai dung class-validator trong main.ts
  constructor(private readonly prisma: PrismaService) { }

  async edit(@Body() user: EditUserDto) {
    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        email: user.email,
        password: user.password,
        name: user.name,
      }
    })
    return { message: 'Changed successful' }
  }

  async findEmail(email: String) {
    return await this.prisma.users.findUnique({
      where: {
        email: email.toString()
      }
    })
  }

  async findById(id: string){
    if (!id) {
      throw new BadRequestException('User ID is required');
    }
    return await this.prisma.users.findUnique({ where: { id }})
  }

  async checkAvailableUser(email: string, pass: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    const isMatch = await argon2.verify(user.password, pass);
    if (!isMatch) throw new UnauthorizedException('Invalid password');
    return user;
  }

}
