import { Module } from "@nestjs/common";
import { PostService } from "./posts.service";
import { PostController } from "./posts.controller";
import { LocalStrategy } from "src/passports/local.strategy";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "../auth/auth.module";

@Module({
    controllers: [PostController],
    providers: [PostService,LocalStrategy],
    imports: [PassportModule,AuthModule]
  })
  export class PostModule {}