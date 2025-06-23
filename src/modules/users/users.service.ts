import { BadRequestException, Body, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EditUserDto } from './users.dto';
import { randomInt } from 'crypto';
const argon2 = require('argon2');
@Injectable()
export class UsersService {
  // muon su dung validator phai dung class-validator trong main.ts
  constructor(private readonly prisma: PrismaService) { }

  private generateStrongPassword(length = 12): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    const allChars = uppercase + lowercase + numbers + symbols

    // Ensure at least one character from each category
    let password = ''
    password += uppercase[randomInt(0, uppercase.length)]
    password += lowercase[randomInt(0, lowercase.length)]
    password += numbers[randomInt(0, numbers.length)]
    password += symbols[randomInt(0, symbols.length)]

    // Fill the rest with random characters
    for (let i = 4; i < length; i++) {
      password += allChars[randomInt(0, allChars.length)]
    }

    // Shuffle the password to make it more random
    const chars = password.split('')
    for (let i = chars.length - 1; i > 0; i--) {
      const j = randomInt(0, i + 1)
      ;[chars[i], chars[j]] = [chars[j], chars[i]]
    }
    return chars.join('')
  }

  async edit(data: EditUserDto) {
    const passwordGenerated = this.generateStrongPassword()
    const hasdedPassword = await argon2.hash(passwordGenerated)

    await this.prisma.users.update({
      where: { email: data.email },
      data: { password: hasdedPassword }
    })

    return passwordGenerated
  }

  async findEmail(email: String) {
    return await this.prisma.users.findUnique({
      where: { email: email.toString() }
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
