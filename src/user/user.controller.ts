import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit_user.dto';
import { UserService } from './user.service';
import { UserProps } from './user.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
@Serialize(UserDto)
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body);

    session.userId = user.id;

    return user;
  }

  @Post('signin')
  async getUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body);

    session.userId = user.id;

    return user;
  }

  @Post('signout')
  signoutUser(@Session() session: any) {
    session.userId = null;
  }

  @Get('current-user')
  @UseGuards(AuthGuard)
  @UseInterceptors(CurrentUserInterceptor)
  getCurrentUser(@CurrentUser() user: UserProps) {
    return user;
  }

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
