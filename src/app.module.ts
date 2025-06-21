import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule,
  ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.prd'],
      load: config,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
