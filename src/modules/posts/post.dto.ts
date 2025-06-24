import { IsNotEmpty } from "class-validator";

export class CreatePost{
    @IsNotEmpty({message: 'Title is not empty'})
    title: string
    @IsNotEmpty({message: 'Content is not empty'})
    content: string
    published: boolean
}

export class FindPost{
    @IsNotEmpty({message: 'Field is not empty'})
    keyword: string
}

export class EditPost extends CreatePost{
    authorId: string
    id: string
}