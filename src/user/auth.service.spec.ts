import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserProps, UserService } from './user.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;
  let users: UserProps[] = [];

  beforeEach(async () => {
    fakeUserService = {
      findOneBy: (term: UserProps): Promise<User> => {
        let user: User;

        for (const key in term) {
          user = users.find((user) => user[key] === term[key]) as User;

          if (user) {
            for (const detailedKey in term) {
              if (user[detailedKey] !== term[detailedKey]) {
                return Promise.resolve(null);
              }
            }
          }
        }

        if (!user) return Promise.resolve(null);

        return Promise.resolve(user);
      },
      insert: (userData: UserProps): Promise<User> => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          ...userData,
        } as User;

        users.push(user);

        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    users = [];
  });

  it('AuthService is defined', () => {
    expect(service).toBeDefined();
  });

  it('signup signs up unique users correctly and hashes their passwords', async () => {
    const user = await service.signup({
      email: 'malek@test.com',
      password: '123',
    });

    expect(users.length).toEqual(1);
    expect(user.password).not.toEqual('123');
  });

  it('signup throws a bad request exception with not unique users', async () => {
    await service.signup({ email: 'malek@test.com', password: '123' });

    await expect(
      service.signup({ email: 'malek@test.com', password: '123' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('signin signs in users with right credentials correctly', async () => {
    await service.signup({ email: 'malek@test.com', password: '123' });

    const user = await service.signin({
      email: 'malek@test.com',
      password: '123',
    });

    expect(user).toBeDefined();
  });

  it('signin throws a bad request exception on not found emails', async () => {
    await service.signup({ email: 'malek@test.com', password: '123' });

    await expect(
      service.signin({
        email: 'malekkk@test.com',
        password: '123',
      }),
    ).rejects.toThrow(BadRequestException);
  });

  it('signin throws a bad request exception on wrong passwords', async () => {
    await service.signup({ email: 'malek@test.com', password: '123' });

    await expect(
      service.signin({
        email: 'malek@test.com',
        password: '12333',
      }),
    ).rejects.toThrow(BadRequestException);
  });
});
