import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PostService{

    constructor(
        private readonly prisma: PrismaService
    ){}

    async createPost(data: any){
        const post = await this.prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                published: data.published,
                authorId: data.user.id,
            }
        })

        return{
            message: 'Create post successful',
            data,
            '@timestamp': new Date().toISOString()
        }

    }

}