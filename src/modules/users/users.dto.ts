import { IsNotEmpty } from "class-validator";

export class EditUserDto {
  @IsNotEmpty({ message: 'Email is not empty' })
  email: string

}

