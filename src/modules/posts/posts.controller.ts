import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { CreatePost, FindPost } from "./post.dto";
import { PostService } from "./posts.service";
import { Response } from "express";
import { AuthCookieGuard } from "src/guards/auth-cookie.guard";

@Controller('blog')
export class PostController {

    constructor(
        private readonly postService: PostService
    ){}

    @UseGuards(AuthCookieGuard)
    @Post('create-post')
    async createPost(@Req() req,@Body() data: CreatePost,@Res({ passthrough: true })res: Response, session_id: string){
        return await this.postService.createPost(req.user,data,res,session_id)
    }

    @Get('post-detail')
    async findPost(@Query()data: FindPost){
        return this.postService.getDeltailPost(data)
    }

    // test
    @Get('getList')
    async getList(){
        return this.postService.getListPost()
    }
}
