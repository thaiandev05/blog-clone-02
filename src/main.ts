import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as passport from 'passport'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
  app.setGlobalPrefix('api')  
  app.enableCors({
    credentials: true, 
  });  
  app.use(passport.initialize())
  app.use(passport.session())
}
bootstrap();
