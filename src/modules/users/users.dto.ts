import { IsEmail, IsNotEmpty, IsStrongPassword } from "class-validator";

export class EditUserDto {
  @IsNotEmpty({ message: 'Id không được bỏ trống' })
  id: string
  @IsEmail({}, { message: 'Email không hợp lệ' })
  @IsNotEmpty({ message: 'Email không được bỏ trống' })
  email: string
  @IsNotEmpty({ message: 'Mật khẩu không được bỏ trống' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  }, { message: 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường và 1 số' })
  password: string
  @IsNotEmpty({ message: 'Tên không được bỏ trống' })
  name: string
}
