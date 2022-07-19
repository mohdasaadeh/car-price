import { Test, TestingModule } from '@nestjs/testing';

import { UserController } from './user.controller';
import { UserProps, UserService } from './user.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {};
    fakeAuthService = {
      signup: (userData: UserProps): Promise<User> =>
        Promise.resolve({ id: 1, ...userData } as User),
      signin: (userData: UserProps): Promise<User> =>
        Promise.resolve({ id: 1, ...userData } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('UserController is defined', () => {
    expect(controller).toBeDefined();
  });

  it('createUser creates users with unique emails correctly and adds their IDs to a session', async () => {
    const session: { userId?: string } = {};

    const user = await controller.createUser(
      { email: 'malek@test.com', password: '123' },
      session,
    );

    expect(user).toBeDefined();
    expect(session.userId).toBeDefined();
  });

  it('getUser gets users with right credentials correctly and adds their IDs to a session', async () => {
    const session: { userId?: string } = {};

    const user = await controller.getUser(
      { email: 'malek@test.com', password: '123' },
      session,
    );

    expect(user).toBeDefined();
    expect(session.userId).toBeDefined();
  });
});
