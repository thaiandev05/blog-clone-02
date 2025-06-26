import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { randomInt } from "crypto";
import { EmailService } from "src/email/emails.service";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";
import { Users } from "generated/prisma";
import { Profile } from "passport-google-oauth20";
import { GoogleUser } from "./auth.dto";
const argon2 = require('argon2')
@Injectable()
export class SocialService {


  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService,
    private readonly authService: AuthService
  ) { }

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


  async validateGoogleUser(profile: GoogleUser) {
    let user = await this.prisma.users.findUnique({
      where: { email: profile.emails[0].value }
    })

    if (!user) {
      const password = this.generateStrongPassword()
      const hashedPassword = await argon2.hash(password);

      user = await this.prisma.users.create({
        data: {
          email: profile.emails[0].value,
          displayName: profile.displayName,
          password: hashedPassword,
          emailVerified: profile.emails[0].verified,
        }
      })

      await this.emailService.sendSocialLoginPassword(user.email, password)
    }

    
  }



}