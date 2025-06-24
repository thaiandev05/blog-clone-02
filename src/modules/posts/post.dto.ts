import { IsNotEmpty } from "class-validator";

export class CreatePost{
    @IsNotEmpty({message: 'Title is not empty'})
    title: string
    @IsNotEmpty({message: 'Content is not empty'})
    content: string
    published: boolean
}