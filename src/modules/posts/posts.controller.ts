import { Body, Controller, Delete, Get, Patch, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { CreatePost, DeletePost, EditPost, FindPost } from "./post.dto";
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

    @Patch('edit-post')
    async editPost(@Body()data: EditPost){
        return await this.postService.editPost(data)
    }

    @Patch('delete-post')
    async deletePost(@Body()data: DeletePost){
        return await this.postService.deletingPost(data)
    }


    // test
    @Get('getList')
    async getList(){
        return this.postService.getListPost()
    }
}
