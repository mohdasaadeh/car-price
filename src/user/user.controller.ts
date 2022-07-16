import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';

@Controller('user')
export class UserController {
  @Post('new')
  createUser(@Body() body: CreateUserDto) {
    console.log(body);
  }
}
