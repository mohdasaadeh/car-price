import { Injectable, BadRequestException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UserService } from './user.service';
import { UserProps } from './user.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async signup(userData: UserProps) {
    const { email, password } = userData;

    const user = await this.userService.findOneBy({ email });

    if (user)
      throw new BadRequestException(
        'The email is already signed up, please try with another email or go to the sign in page.',
      );

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashAndSalt = hash.toString('hex') + '.' + salt;

    userData.password = hashAndSalt;

    return this.userService.insert(userData);
  }

  async signin(userData: UserProps) {
    const { email, password } = userData;

    const user = await this.userService.findOneBy({ email });

    if (!user)
      throw new BadRequestException('The email or password is incorrect!');

    const [userHash, userSalt] = user.password.split('.');

    const hash = (await scrypt(password, userSalt, 32)) as Buffer;

    if (hash.toString('hex') !== userHash)
      throw new BadRequestException('The email or password is incorrect!');

    return user;
  }
}
