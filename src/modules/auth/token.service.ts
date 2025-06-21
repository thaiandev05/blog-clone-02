import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "src/prisma/prisma.service";
const argon2 = require('argon2');



@Injectable()
export class TokenService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) { }


    async verifyRefreshToken(userId: string, refreshToken: string) {
        const session = await this.prisma.session.findFirst({
            where: {
                userId: userId,
                token: refreshToken,
            }
        });

        if (!session) {
            throw new ForbiddenException('Refresh token not found');
        }
        // using argon2 to verify the refresh token
        const isValid = await argon2.verify(session.token, refreshToken);
        if (!isValid) {
            throw new ForbiddenException('Invalid refresh token');
        }

        if (new Date(session.expiresAt) < new Date()) {
            throw new ForbiddenException('Refresh token expired');
        }

        return session;

    }

    async saveRefreshToken(userId: string, refreshToken: string, sessionId: string) {
        const hashedToken = await argon2.hash(refreshToken);
        const user = await this.prisma.users.findFirst({
            where: { id: userId },
        })

        this.prisma.session.create({
            data: {
                userId: userId,
                token: hashedToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        }).catch((error) => {
            throw new BadRequestException('Error saving refresh token');
        });
    }

    async generateRefreshToken(userId: string, email: string) {
        const payload  = { sub: userId, email: email }

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.config.getOrThrow<string>('jwt.secret'),
                expiresIn: this.config.getOrThrow<string>('jwt.expiresIn'),
            }),
            this.jwtService.signAsync(payload, {
                secret: this.config.getOrThrow<string>('jwt.secretRefresh'),
                expiresIn: this.config.getOrThrow<string>('jwt.refreshExpiresIn'),
            }),
        ])
        return { accessToken, refreshToken }
    }

}