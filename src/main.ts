import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Add cookie parser middleware
  app.use(cookieParser());
  
  // Cho phép validator sử dụng DI từ NestJS
//   ✅ Khi nào cần useContainer(...)?
// Khi bạn sử dụng custom validator (@Validate(...)) mà bên trong cần inject service của NestJS.

// Thường dùng trong các ứng dụng có logic như:

// Check email duy nhất

// Check username đã tồn tại

// Validate foreign key tồn tại trong DB
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
