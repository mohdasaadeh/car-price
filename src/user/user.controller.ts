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
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  createUser(@Body() body: CreateUserDto) {
    this.userService.insert(body);
  }

  @Get()
  findUsers() {
    return this.userService.find();
  }

  @Get('by_email')
  findUsersByEmail(@Query('email') email: string) {
    return this.userService.findBy({ email });
  }

  @Get(':id')
  findUserById(@Param('id') id: string) {
    return this.userService.findById(parseInt(id));
  }

  @Patch(':id/edit')
  editUser(@Param('id') id: string, @Body() body: CreateUserDto) {
    this.userService.findByIdAndUpdate(parseInt(id), body);
  }

  @Delete(':id/delete')
  deleteUser(@Param('id') id: string) {
    this.userService.findByIdAndDelete(parseInt(id));
  }
}
