import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreatePost } from "./post.dto";
import { Response } from "express";
import { Users } from "generated/prisma";

@Injectable()
export class PostService{

    constructor(
        private readonly prisma: PrismaService
    ){}

    async createPost(user: Users,data: CreatePost,res: Response, session_id?: string){

        const post = await this.prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                published: data.published,
                authorId: user.id
            }
        })

        return{
            message: 'Create post successful',
            data,
            '@timestamp': new Date().toISOString()
        }

    }





    // test
    async getListPost(){
        return await this.prisma.post.findMany()
    }

}