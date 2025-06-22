import { Injectable } from "@nestjs/common"
import { IsEmail, IsNotEmpty, IsStrongPassword, Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator"
import { UsersService } from "src/modules/users/users.service"

@ValidatorConstraint({ name: 'IsUniqueEmail', async: true })
@Injectable()
export class IsUniqueEmail implements ValidatorConstraintInterface {
  constructor(private readonly userService: UsersService) {}
  async validate(text: string, args: ValidationArguments) {
    const user = await this.userService.findEmail(text);
    return !user;
  }
}

export class VerifyingUserEmail{
  @IsEmail({}, { message: 'Email is not accepted' })
  @IsNotEmpty({ message: 'Email is not empty' })
  email: string;
}

export class VerifiedEmail extends VerifyingUserEmail{
  @IsNotEmpty({ message: 'Code is not empty'})
  code: string
}

export class AvailableUserDto extends VerifyingUserEmail{
  @IsNotEmpty({ message: 'Password is not empty' })  
  password: string; 
}

export class RegisterUserDto implements Partial<AvailableUserDto>{
  @Validate(IsUniqueEmail, { message: 'Email is available' })
  declare email: string;
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
  }, { message: 'Password must be at least 8 characters, 1 uppercase letter, 1 lowercase letter and 1 number' })
  declare password: string;
  @IsNotEmpty({ message: 'Name is not empty' })
  name: string
}
