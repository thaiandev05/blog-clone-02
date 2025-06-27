import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport'


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe());
  
  // Session middleware (required for passport.session())
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'super_secret',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    }),
  );
  
  app.use(passport.initialize());
  app.use(passport.session());
  
  passport.serializeUser((user, done) => {
    done(null, user.id); // hoặc user.email, hoặc user object tùy bạn
  });

  passport.deserializeUser(async (id, done) => {
    // Tìm user từ DB theo id
    // Ví dụ:
    // const user = await userService.findById(id);
    // done(null, user);
    // Nếu chưa có userService, bạn có thể hardcode hoặc mock tạm thời
    done(null, { id }); // Tạm thời
  });
  
  await app.listen(process.env.PORT ?? 3000);
  app.setGlobalPrefix('api')  
  app.enableCors({
    credentials: true, 
  });  
}
bootstrap();
