import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit_user.dto';
import { UserService } from './user.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    return this.authService.signup(body);
  }

  @Post('signin')
  getUser(@Body() body: CreateUserDto) {
    return this.authService.signin(body);
  }

  @Serialize(UserDto)
  @Get()
  findUsers() {
    return this.userService.find();
  }

  @Get('by_email')
  findUserByEmail(@Query('email') email: string) {
    return this.userService.findOneBy({ email });
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.userService.findById(parseInt(id));
  }

  @Patch(':id/edit')
  editUser(@Param('id') id: string, @Body() body: EditUserDto) {
    return this.userService.findByIdAndUpdate(parseInt(id), body);
  }

  @Delete(':id/delete')
  deleteUser(@Param('id') id: string) {
    return this.userService.findByIdAndDelete(parseInt(id));
  }
}
