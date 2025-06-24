import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import { ScheduleModule } from '@nestjs/schedule';
import { TaskService } from './modules/tasks/tasks.service';
import { PostModule } from './modules/posts/posts.module';

@Module({
  imports: [UsersModule, PrismaModule, AuthModule,PostModule,
  ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.dev', '.env.prd'],
      load: config,
      
    }),
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService,TaskService],
})
export class AppModule { }
