import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthorPost, CreatePost, DeletePost, EditPost, FindPost } from "./post.dto";
import { Response } from "express";
import { Post, Users } from "generated/prisma";

@Injectable()
export class PostService {

    constructor(
        private readonly prisma: PrismaService
    ) {}

    async loadingAllPost(data: AuthorPost){

        const list: Post[] = await this.prisma.post.findMany({
            where: { authorId: data.authorId }
        })

        if(list.length === 0){
            throw new NotFoundException('User have not post something yet')
        }
        return list
    }


    async createPost(user: Users, data: CreatePost, res: Response, session_id?: string) {

        const post = await this.prisma.post.create({
            data: {
                title: data.title,
                content: data.content,
                published: data.published,
                authorId: user.id
            }
        })

        return {
            message: 'Create post successful',
            data,
            '@timestamp': new Date().toISOString()
        }

    }


    async getDeltailPost(data: FindPost) {
        const { keyword } = data
        const exitedPost = await this.prisma.post.findMany({
            where: {
                OR: [
                    {
                        id: { contains: keyword, mode: 'insensitive' }
                    },
                    {
                        title: { contains: keyword, mode: 'insensitive' },
                    },
                ],
            }
        })

        if (!exitedPost || exitedPost.length === 0) {
            throw new NotFoundException('No result is matched')
        }

        return {
            exitedPost,
            '@timestamp': new Date().toISOString()
        }
    }

    async editPost(data: EditPost){
        const author = await this.prisma.post.findFirst({
            where: {
              id: data.id,
              authorId: data.authorId,
            },
        })

        if(!author){
            throw new BadRequestException('You are not author')
        }

        const newPost = await this.prisma.post.update({
            where: { id: data.id },
            data: {
                title: data.title,
                content: data.content,
                published: data.published,
                updatedAt: new Date()
            }
        })

        return{
            message: 'Edit successful',
            newPost,
            '@timestamp': new Date().toISOString()
        }
    }

    async deletingPost(data: DeletePost){
        const author = await this.prisma.post.findFirst({
            where: {
              id: data.id,
              authorId: data.authorId,
            },
        })

        if(!author){
            throw new BadRequestException('You are not author')
        }
        const newPost = await this.prisma.post.update({
            where: { id: data.id },
            data: {
                isDelete: true,
                deletedAt: new Date()
            }
        })

        return{
            message: 'Deleted successful',
            newPost,
            '@timestamp': new Date().toISOString()
        }
    }

    async loadingUserPost(){
        return await this.prisma.post.findMany()
    }

}