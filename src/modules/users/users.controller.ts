import { Body, Controller, Post } from '@nestjs/common';
import { EditUserDto } from './users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService){}

  @Post('edit')
  editUser(@Body()user: EditUserDto){
    return this.usersService.edit(user)
  }
}
