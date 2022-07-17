import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.entity';

interface UserProps {
  id?: number;
  email?: string;
  password?: string;
}

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  insert(body: UserProps): Promise<User> {
    const user = this.repo.create(body);

    return this.repo.save(user);
  }

  find(): Promise<User[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<User> {
    return this.repo.findOneBy({ id });
  }

  findBy(attrs: UserProps): Promise<User[]> {
    return this.repo.find({ where: attrs });
  }

  async findByIdAndUpdate(id: number, attrs: UserProps): Promise<User> {
    const user = await this.repo.findOneBy({ id });

    if (!user) throw new NotFoundException('The user was not found!');

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async findByIdAndDelete(id: number): Promise<User> {
    const user = await this.repo.findOneBy({ id });

    if (!user) throw new NotFoundException('The user was not found!');

    return this.repo.remove(user);
  }
}
